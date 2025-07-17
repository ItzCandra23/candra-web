"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Grid3x3, Pencil, Eraser } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

// Configuration
const MIN_GRID_SIZE = 8;
const MAX_GRID_SIZE = 64;
const DEFAULT_GRID_SIZE = 16;
const CANVAS_DISPLAY_SIZE = 600; // Fixed display size in pixels

// Predefined color palette
const COLOR_PALETTE = [
  "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF", "#FFFF00",
  "#FF00FF", "#00FFFF", "#800000", "#008000", "#000080", "#808000",
  "#800080", "#008080", "#C0C0C0", "#808080", "#FF6B6B", "#4ECDC4",
  "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E2"
];

type Tool = "pencil" | "eraser";

export function PixelArtCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gridSize, setGridSize] = useState(DEFAULT_GRID_SIZE);
  const [showGrid, setShowGrid] = useState(true);
  const [currentColor, setCurrentColor] = useState("#000000");
  const [currentTool, setCurrentTool] = useState<Tool>("pencil");
  const [isDrawing, setIsDrawing] = useState(false);
  const [pixels, setPixels] = useState<(string | null)[][]>(() => 
    Array(gridSize).fill(null).map(() => Array(gridSize).fill(null))
  );

  const pixelSize = CANVAS_DISPLAY_SIZE / gridSize;

  // Update pixels array when grid size changes
  useEffect(() => {
    setPixels(prevPixels => {
      const newPixels = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));
      
      // Copy existing pixels if possible
      const minSize = Math.min(prevPixels.length, gridSize);
      for (let i = 0; i < minSize; i++) {
        for (let j = 0; j < minSize; j++) {
          if (prevPixels[i] && prevPixels[i][j] !== undefined) {
            newPixels[i][j] = prevPixels[i][j];
          }
        }
      }
      
      return newPixels;
    });
  }, [gridSize]);

  // Draw pixel grid
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas with transparent background
    ctx.clearRect(0, 0, CANVAS_DISPLAY_SIZE, CANVAS_DISPLAY_SIZE);

    // Draw checkerboard pattern for transparent areas
    ctx.fillStyle = "#F3F4F6";
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if ((i + j) % 2 === 0) {
          ctx.fillRect(j * pixelSize, i * pixelSize, pixelSize, pixelSize);
        }
      }
    }

    // Draw pixels
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (pixels[row] && pixels[row][col]) {
          ctx.fillStyle = pixels[row][col] ?? "";
          ctx.fillRect(col * pixelSize, row * pixelSize, pixelSize, pixelSize);
        }
      }
    }

    // Draw grid lines if enabled
    if (showGrid) {
      ctx.strokeStyle = "#E5E7EB";
      ctx.lineWidth = 1;

      // Vertical lines
      for (let i = 0; i <= gridSize; i++) {
        ctx.beginPath();
        ctx.moveTo(i * pixelSize, 0);
        ctx.lineTo(i * pixelSize, CANVAS_DISPLAY_SIZE);
        ctx.stroke();
      }

      // Horizontal lines
      for (let i = 0; i <= gridSize; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * pixelSize);
        ctx.lineTo(CANVAS_DISPLAY_SIZE, i * pixelSize);
        ctx.stroke();
      }
    }
  }, [pixels, pixelSize, gridSize, showGrid]);

  // Update canvas when dependencies change
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Get pixel coordinates from mouse position
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

    if (col >= 0 && col < gridSize && row >= 0 && row < gridSize) {
      return { row, col };
    }
    return null;
  };

  // Draw or erase pixel
  const updatePixel = (row: number, col: number) => {
    setPixels(prev => {
      const newPixels = prev.map((r, i) => 
        i === row ? r.map((c, j) => j === col ? (currentTool === "pencil" ? currentColor : null) : c) : [...r]
      );
      return newPixels;
    });
  };

  // Mouse and touch event handlers
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

  // Clear canvas
  const clearCanvas = () => {
    setPixels(Array(gridSize).fill(null).map(() => Array(gridSize).fill(null)));
  };

  // Download as PNG
  const downloadAsPNG = () => {
    // Create a canvas with actual pixel dimensions
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = gridSize;
    tempCanvas.height = gridSize;
    const tempCtx = tempCanvas.getContext("2d");
    
    if (!tempCtx) return;

    // Draw pixels at 1:1 scale
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (pixels[row] && pixels[row][col]) {
          tempCtx.fillStyle = pixels[row][col] ?? "";
          tempCtx.fillRect(col, row, 1, 1);
        }
      }
    }

    // Download
    tempCanvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `pixel-art-${gridSize}x${gridSize}-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 mt-12 items-start">
      {/* Canvas */}
      <div className="flex-1 flex justify-center">
        <Card className="inline-block p-2 sm:p-4">
          <canvas
            ref={canvasRef}
            width={CANVAS_DISPLAY_SIZE}
            height={CANVAS_DISPLAY_SIZE}
            className="border border-border cursor-crosshair max-w-full touch-none"
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
              width: "100%",
              maxWidth: `${CANVAS_DISPLAY_SIZE}px`,
              height: "auto",
              aspectRatio: "1/1"
            }}
          />
        </Card>
      </div>

      {/* Controls */}
      <div className="w-full lg:w-80 space-y-4 lg:space-y-6">
        {/* Canvas Controls */}
        <Card className="p-4 lg:p-6 space-y-4">
          <h3 className="font-semibold text-lg">Canvas Settings</h3>
          
          {/* Grid Size Slider */}
          <div className="space-y-2">
            <Label>Grid Size: {gridSize}x{gridSize}</Label>
            <Slider
              value={[gridSize]}
              onValueChange={(value) => setGridSize(value[0])}
              min={MIN_GRID_SIZE}
              max={MAX_GRID_SIZE}
              step={8}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Output image will be {gridSize}x{gridSize} pixels
            </p>
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

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button 
              onClick={clearCanvas}
              variant="outline"
              className="w-full"
            >
              Clear Canvas
            </Button>
            <Button 
              onClick={downloadAsPNG}
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PNG ({gridSize}x{gridSize})
            </Button>
          </div>
        </Card>

        {/* Drawing Tools */}
        <Card className="p-4 lg:p-6 space-y-4">
          <h3 className="font-semibold text-lg">Tools</h3>
          
          {/* Tool Selection */}
          <div className="flex gap-2">
            <Button
              variant={currentTool === "pencil" ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentTool("pencil")}
              className="flex-1"
            >
              <Pencil className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Draw</span>
            </Button>
            <Button
              variant={currentTool === "eraser" ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentTool("eraser")}
              className="flex-1"
            >
              <Eraser className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Erase</span>
            </Button>
          </div>

          {/* Current Color Display */}
          {currentTool === "pencil" && (
            <div className="space-y-2">
              <Label>Current Color</Label>
              <div
                className="w-full h-12 rounded-md border-2 border-border"
                style={{ backgroundColor: currentColor }}
              />
            </div>
          )}
        </Card>

        {/* Color Palette */}
        {currentTool === "pencil" && (
          <Card className="p-4 lg:p-6 space-y-4">
            <h3 className="font-semibold text-lg">Color Palette</h3>
            <div className="grid grid-cols-6 gap-2">
              {COLOR_PALETTE.map((color) => (
                <button
                  key={color}
                  className={`w-full aspect-square rounded-md border-2 transition-all hover:scale-110 ${
                    currentColor === color ? "border-primary ring-2 ring-primary ring-offset-2" : "border-border"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setCurrentColor(color)}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
            
            {/* Custom Color Picker */}
            <div className="space-y-2">
              <Label htmlFor="colorPicker">Custom Color</Label>
              <div className="flex gap-2">
                <input
                  id="colorPicker"
                  type="color"
                  value={currentColor}
                  onChange={(e) => setCurrentColor(e.target.value)}
                  className="h-10 w-full cursor-pointer"
                />
                <input
                  type="text"
                  value={currentColor}
                  onChange={(e) => setCurrentColor(e.target.value)}
                  className="flex h-10 w-20 sm:w-24 rounded-md border border-input bg-background px-2 sm:px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}