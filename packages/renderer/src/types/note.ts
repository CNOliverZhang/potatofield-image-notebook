import Shape from 'canvas-select/lib/shape/Shape';

export enum TagShape {
  NONE = 0,
  RECT = 1,
  POLY = 2,
  DOT = 3,
  LINE = 4,
  CIRCLE = 5,
}

export interface Tag extends Shape {
  label: string;
  coor: number[] | number[][];
  radius?: number;
  type: TagShape;
  data?: string;
}

export interface Note {
  id: string;
  title: string;
  desc?: string;
  image: string;
  tags: Tag[];
  createTime: Date;
  updateTime: Date;
}
