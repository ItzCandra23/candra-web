"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Grid3x3, Pencil, Eraser, Moon, Sun, Grid2X2, Copy, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Configuration
const GRID = 16;
const DEFAULT_HEX = "E0";
const CANVAS_SIZE = 256; // Fixed canvas size for editing
const GLYPH_SIZE = 16; // Size for individual glyph editing

// Predefined color palette
const COLOR_PALETTE = [
  "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF", "#FFFF00",
  "#FF00FF", "#00FFFF", "#800000", "#008000", "#000080", "#808000",
  "#800080", "#008080", "#C0C0C0", "#808080"
];

type Tool = "pencil" | "eraser";
type GlyphPixelData = (string | null)[][];

interface GlyphData {
  hex: string;
  char: string;
  position: string;
  pixelData?: GlyphPixelData;
  hasCustomImage?: boolean;
}

export function GlyphGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hexInput, setHexInput] = useState(DEFAULT_HEX);
  const [currentHex, setCurrentHex] = useState(DEFAULT_HEX);
  const [glyphs, setGlyphs] = useState<GlyphData[]>([]);
  const [selectedGlyph, setSelectedGlyph] = useState<GlyphData | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [currentColor, setCurrentColor] = useState("#000000");
  const [currentTool, setCurrentTool] = useState<Tool>("pencil");
  const [isDrawing, setIsDrawing] = useState(false);
  const [customGlyphData, setCustomGlyphData] = useState<Record<string, GlyphPixelData>>({});
  const [isEditMode, setIsEditMode] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [canvasGrid, setCanvasGrid] = useState(true);
  const [canvasGap, setCanvasGap] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const pixelSize = CANVAS_SIZE / GLYPH_SIZE;

  // Generate glyphs based on hex input
  const generateGlyphs = useCallback((hex: string) => {
    const startChar = parseInt(hex + "00", 16);
    const newGlyphs: GlyphData[] = [];

    for (let i = 0; i < GRID * GRID; i++) {
      const row = Math.floor(i / GRID) + 1;
      const col = (i % GRID) + 1;
      const charCode = startChar + i;
      const char = String.fromCodePoint(charCode);
      const hexCode = charCode.toString(16).toUpperCase().padStart(4, '0');

      newGlyphs.push({
        hex: `0x${hexCode}`,
        char,
        position: `(${col};${row})`,
        pixelData: customGlyphData[hexCode]
      });
    }

    setGlyphs(newGlyphs);
  }, [customGlyphData]);

  // Initialize glyphs on mount
  useEffect(() => {
    generateGlyphs(hexInput);
  }, [generateGlyphs]);

  // Handle hex input change
  const handleHexInputChange = (value: string) => {
    const cleanValue = value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 2);
    setHexInput(cleanValue);
    
    if (/^[A-Fa-f0-9]{1,2}$/.test(cleanValue)) {
      setCurrentHex(cleanValue || DEFAULT_HEX);
      generateGlyphs(cleanValue || DEFAULT_HEX);
      setErrorMessage("");
    } else if (cleanValue.length > 0) {
      setErrorMessage("Please enter a valid hex value (1-2 hex digits).");
    }
  };

  // Draw the editor canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedGlyph) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw checkerboard for transparency
    ctx.fillStyle = "#F3F4F6";
    for (let i = 0; i < GLYPH_SIZE; i++) {
      for (let j = 0; j < GLYPH_SIZE; j++) {
        if ((i + j) % 2 === 0) {
          ctx.fillRect(j * pixelSize, i * pixelSize, pixelSize, pixelSize);
        }
      }
    }

    // Get pixel data for current glyph
    const hexKey = selectedGlyph.hex.slice(2); // Remove "0x" prefix
    const pixelData = customGlyphData[hexKey] || Array(GLYPH_SIZE).fill(null).map(() => Array(GLYPH_SIZE).fill(null));

    // Draw pixels
    for (let row = 0; row < GLYPH_SIZE; row++) {
      for (let col = 0; col < GLYPH_SIZE; col++) {
        if (pixelData[row] && pixelData[row][col]) {
          ctx.fillStyle = pixelData[row][col] ?? "";
          ctx.fillRect(col * pixelSize, row * pixelSize, pixelSize, pixelSize);
        }
      }
    }

    // Draw grid if enabled
    if (showGrid) {
      ctx.strokeStyle = "#E5E7EB";
      ctx.lineWidth = 1;

      for (let i = 0; i <= GLYPH_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * pixelSize, 0);
        ctx.lineTo(i * pixelSize, CANVAS_SIZE);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * pixelSize);
        ctx.lineTo(CANVAS_SIZE, i * pixelSize);
        ctx.stroke();
      }
    }
  }, [selectedGlyph, customGlyphData, pixelSize, showGrid]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Get pixel coordinates from mouse/touch position
  const getPixelCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    const col = Math.floor(x / pixelSize);
    const row = Math.floor(y / pixelSize);

    if (col >= 0 && col < GLYPH_SIZE && row >= 0 && row < GLYPH_SIZE) {
      return { row, col };
    }
    return null;
  };

  // Update pixel in the current glyph
  const updatePixel = (row: number, col: number) => {
    if (!selectedGlyph) return;

    const hexKey = selectedGlyph.hex.slice(2);
    const currentData = customGlyphData[hexKey] || Array(GLYPH_SIZE).fill(null).map(() => Array(GLYPH_SIZE).fill(null));
    
    const newData = currentData.map((r, i) => 
      i === row ? r.map((c, j) => j === col ? (currentTool === "pencil" ? currentColor : null) : c) : [...r]
    );
    
    setCustomGlyphData(prev => ({
      ...prev,
      [hexKey]: newData
    }));

    // Update glyphs array
    setGlyphs(prev => prev.map(g => 
      g.hex === selectedGlyph.hex ? { ...g, pixelData: newData } : g
    ));
  };

  // Canvas event handlers
  const handleStart = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const coords = getPixelCoords(e);
    if (coords) {
      setIsDrawing(true);
      updatePixel(coords.row, coords.col);
    }
  };

  const handleMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const coords = getPixelCoords(e);
    if (coords) {
      updatePixel(coords.row, coords.col);
    }
  };

  const handleEnd = () => {
    setIsDrawing(false);
  };

  // useEffect(() => {
  //   handleHexInputChange(hexInput);
  // }, [isDrawing]);

  // Clear current glyph
  const clearGlyph = () => {
    if (!selectedGlyph) return;
    const hexKey = selectedGlyph.hex.slice(2);
    
    setCustomGlyphData(prev => ({
      ...prev,
      [hexKey]: Array(GLYPH_SIZE).fill(null).map(() => Array(GLYPH_SIZE).fill(null))
    }));

    setGlyphs(prev => prev.map(g => 
      g.hex === selectedGlyph.hex ? { ...g, pixelData: undefined } : g
    ));
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileNameRegex = /^glyph_([0-9A-F]{2})\.png$/i;
    const match = file.name.match(fileNameRegex);
    
    if (!match) {
      setErrorMessage("Invalid file name. Please use the format glyph_XX.png where XX is a hex value from 00 to FF.");
      return;
    }

    const hexValue = match[1].toUpperCase();
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        processUploadedImage(img, hexValue);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Process uploaded image
  const processUploadedImage = (img: HTMLImageElement, hexValue: string) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const unicodeSize = Math.floor(Math.min(img.width, img.height) / 16);
    canvas.width = unicodeSize * 16;
    canvas.height = unicodeSize * 16;

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const startChar = parseInt(hexValue + "00", 16);

    // Process each glyph in the image
    for (let i = 0; i < 256; i++) {
      const x = (i % 16) * unicodeSize;
      const y = Math.floor(i / 16) * unicodeSize;
      
      const pixelData: GlyphPixelData = Array(GLYPH_SIZE).fill(null).map(() => Array(GLYPH_SIZE).fill(null));
      
      // Extract pixel data
      for (let row = 0; row < GLYPH_SIZE; row++) {
        for (let col = 0; col < GLYPH_SIZE; col++) {
          const srcX = x + (col * unicodeSize / GLYPH_SIZE);
          const srcY = y + (row * unicodeSize / GLYPH_SIZE);
          
          const imageData = ctx.getImageData(srcX, srcY, 1, 1);
          const [r, g, b, a] = imageData.data;
          
          if (a > 0) {
            pixelData[row][col] = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
          }
        }
      }

      const hexCode = (startChar + i).toString(16).toUpperCase().padStart(4, '0');
      setCustomGlyphData(prev => ({
        ...prev,
        [hexCode]: pixelData
      }));
    }

    setHexInput(hexValue);
    setCurrentHex(hexValue);
    generateGlyphs(hexValue);
  };

  // Copy glyph
  const handleCopyGlyph = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Download all glyphs as image
  const downloadAllGlyphs = () => {
    const canvas = document.createElement('canvas');
    const size = GLYPH_SIZE * GRID;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // Draw each glyph
    glyphs.forEach((glyph, index) => {
      const row = Math.floor(index / GRID);
      const col = index % GRID;
      const hexKey = glyph.hex.slice(2);
      const pixelData = customGlyphData[hexKey];

      if (pixelData) {
        for (let r = 0; r < GLYPH_SIZE; r++) {
          for (let c = 0; c < GLYPH_SIZE; c++) {
            if (pixelData[r] && pixelData[r][c]) {
              ctx.fillStyle = pixelData[r][c] ?? "";
              ctx.fillRect(col * GLYPH_SIZE + c, row * GLYPH_SIZE + r, 1, 1);
            }
          }
        }
      }
    });

    // Download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `glyph_${currentHex}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  };

  // Render glyph preview
  const renderGlyphPreview = (glyph: GlyphData) => {
    const hexKey = glyph.hex.slice(2);
    const pixelData = customGlyphData[hexKey];
    const hasContent = pixelData && pixelData.some(row => row.some(pixel => pixel !== null));

    return (
      <div
        className={`relative group cursor-pointer transition-all ${
          isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
        }`}
      >
        {hasContent ? (
          <canvas
            width={32}
            height={32}
            className="w-full h-full"
            style={{ imageRendering: 'pixelated' }}
            ref={(canvas) => {
              if (!canvas) return;
              const ctx = canvas.getContext('2d');
              if (!ctx) return;

              ctx.clearRect(0, 0, 32, 32);
              
              for (let r = 0; r < GLYPH_SIZE; r++) {
                for (let c = 0; c < GLYPH_SIZE; c++) {
                  if (pixelData[r] && pixelData[r][c]) {
                    ctx.fillStyle = pixelData[r][c] ?? "";
                    ctx.fillRect(c * 2, r * 2, 2, 2);
                  }
                }
              }
            }}
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center text-2xl ${
            isDarkMode ? 'text-white' : 'text-black'
          }`}>
            {glyph.char}
          </div>
        )}
        
        {/* Tooltip */}
        <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 ${
          isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-900 text-white'
        }`}>
          Position: {glyph.position} - Hex: {glyph.hex}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 mt-12">
      {/* Input Controls */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="glyphHex">Glyph Hex (1-2 digits)</Label>
              <div className="flex gap-2">
                <Input
                  id="glyphHex"
                  value={hexInput}
                  onChange={(e) => handleHexInputChange(e.target.value)}
                  placeholder="E0"
                  className="font-mono"
                />
              </div>
            </div>
            
            <div className="flex-1 space-y-2">
              <Label>Upload Glyph Image</Label>
              <div className="flex gap-2">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload PNG (glyph_XX.png)
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <Label>Download Glyph</Label>
            <div className="flex gap-2">
              <Button onClick={downloadAllGlyphs} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download All
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-end">
            <Button
              onClick={() => setCanvasGap(!canvasGap)}
              variant="outline"
              size="sm"
            >
              <Grid2X2 className="h-4 w-4 mr-2" />
              {canvasGap ? 'No' : 'Show'} Gap
            </Button>
            <Button
              onClick={() => setCanvasGrid(!canvasGrid)}
              variant="outline"
              size="sm"
            >
              <Grid3x3 className="h-4 w-4 mr-2" />
              {canvasGrid ? 'Hide' : 'Show'} Grid
            </Button>
            <Button
              onClick={() => setIsDarkMode(!isDarkMode)}
              variant="outline"
              size="sm"
            >
              {isDarkMode ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
              {isDarkMode ? 'Light' : 'Dark'} Mode
            </Button>
            <Button onClick={() => setIsEditMode(!isEditMode)} size="sm">
              {isEditMode ? <Copy className="mr-2 h-4 w-4" /> : <Pencil className="mr-2 h-4 w-4" />}
              {isEditMode ? 'Copy' : 'Edit'} Mode
            </Button>
          </div>
        </div>
        
        {errorMessage && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
      </Card>

      {/* Glyph Grid */}
      <Card className={`p-6 ${isDarkMode ? 'bg-gray-900' : ''}`}>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Generated Glyph</h3>
          
          <div className="max-md:overflow-x-scroll">
            <div className={`grid grid-cols-16 ${canvasGap ? "gap-0.5" : ""} min-w-[640px] p-4 bg-muted/50 rounded-lg`}>
              {glyphs.map((glyph, index) => (
                <button
                  key={index}
                  onClick={() => isEditMode ? setSelectedGlyph(glyph) : handleCopyGlyph(glyph.char)}
                  className={`aspect-square ${canvasGrid ? 'border' : ''} transition-all hover:scale-110 hover:z-10 ${
                    isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}
                >
                  {renderGlyphPreview(glyph)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Glyph Editor Dialog */}
      <Dialog open={!!selectedGlyph} onOpenChange={(open) => !open && setSelectedGlyph(null)}>
        <DialogContent className="max-w-4xl flex flex-col max-h-full max-md:overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>
                Edit Glyph {selectedGlyph?.hex} - Position: {selectedGlyph?.position}
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="flex max-md:flex-col flex-row gap-6">
            {/* Canvas */}
            <div className="flex-1 flex justify-center">
              <canvas
                ref={canvasRef}
                width={CANVAS_SIZE}
                height={CANVAS_SIZE}
                className="border border-border cursor-crosshair touch-none"
                onMouseDown={handleStart}
                onMouseMove={handleMove}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                onTouchStart={handleStart}
                onTouchMove={handleMove}
                onTouchEnd={handleEnd}
                style={{
                  imageRendering: "pixelated",
                  cursor: currentTool === "pencil" ? "crosshair" : "grab",
                  maxWidth: "260px",
                  maxHeight: "260px",
                }}
              />
            </div>

            {/* Controls */}
            <div className="w-full lg:w-64 space-y-4">
              {/* Tools */}
              <div className="space-y-2">
                <Label>Tools</Label>
                <div className="flex gap-2">
                  <Button
                    variant={currentTool === "pencil" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentTool("pencil")}
                    className="flex-1"
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Draw
                  </Button>
                  <Button
                    variant={currentTool === "eraser" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentTool("eraser")}
                    className="flex-1"
                  >
                    <Eraser className="h-4 w-4 mr-1" />
                    Erase
                  </Button>
                </div>
              </div>

              {/* Grid Toggle */}
              <div className="flex items-center justify-between">
                <Label>Show Grid</Label>
                <Button
                  variant={showGrid ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowGrid(!showGrid)}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
              </div>

              {/* Color Palette */}
              {currentTool === "pencil" && (
                <div className="space-y-2">
                  <Label>Colors</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {COLOR_PALETTE.map((color) => (
                      <button
                        key={color}
                        className={`w-full aspect-square rounded border-2 transition-all hover:scale-110 ${
                          currentColor === color ? "border-primary ring-2 ring-primary" : "border-border"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setCurrentColor(color)}
                      />
                    ))}
                  </div>
                  <Input
                    type="color"
                    value={currentColor}
                    onChange={(e) => setCurrentColor(e.target.value)}
                    className="h-10 cursor-pointer"
                  />
                </div>
              )}

              {/* Actions */}
              <Button onClick={clearGlyph} variant="outline" className="w-full">
                Clear Glyph
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}