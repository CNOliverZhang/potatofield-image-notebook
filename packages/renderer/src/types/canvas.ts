import CanvasSelect from 'canvas-select';

export interface CanvasExtend extends CanvasSelect {
  readonly?: boolean;
  resize?: () => void;
}
