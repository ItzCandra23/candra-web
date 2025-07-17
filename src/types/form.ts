export interface TextInput {
  require?: boolean;
  id: string;
  type: "text";
  name: string;
  placeholder: string;
  defaultValue?: string;
}

export interface TextAreaInput {
  require?: boolean;
  id: string;
  type: "textarea";
  name: string;
  placeholder: string;
  rows?: number;
  defaultValue?: string;
}

export interface NumberInput {
  require?: boolean;
  id: string;
  type: "number";
  name: string;
  placeholder: string;
  min?: number;
  max?: number;
  defaultValue?: string;
}

export interface CheckBoxOption {
  id: string;
  title: string;
  description: string;
  dependencies?: string[];
  value: string;
  visit?: string;
  checked?: boolean;
}

export interface CheckBoxInput {
  require?: boolean;
  id: string;
  type: "checkbox";
  name: string;
  options: CheckBoxOption[];
  multiple?: boolean;
}

export interface CheckListOption {
  id: string;
  label: string;
  value: string;
  dependencies?: string[];
  checked?: boolean;
}

export interface CheckListInput {
  require?: boolean;
  id: string;
  type: "checklist";
  name: string;
  options: CheckListOption[];
  multiple?: boolean;
  listStyle?: string;
}

export interface DropdownOption {
  id: string;
  name: string;
  description?: string;
  value?: string;
  default?: boolean;
}

export interface DropdownInput {
  require?: boolean;
  id: string;
  type: "dropdown";
  name: string;
  options: DropdownOption[];
}

export interface ImageInput {
  require?: boolean;
  id: string;
  type: "image";
  name: string;
  accept?: string;
  multiple?: boolean;
}

export interface FileInput {
  require?: boolean;
  id: string;
  type: "file";
  name: string;
  accept: string;
  multiple?: boolean;
}

export type GroupType = TextInput | NumberInput | DropdownInput;

export interface GroupInput {
  type: "group";
  first: GroupType;
  second: GroupType;
}

export type InputType = GroupInput | TextInput | TextAreaInput | NumberInput | CheckBoxInput | CheckListInput | DropdownInput | ImageInput | FileInput;

export type JsonForm = InputType[];