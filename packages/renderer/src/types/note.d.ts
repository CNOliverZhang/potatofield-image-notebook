enum TagShape {
  NONE = 0,
  RECT = 1,
  POLY = 2,
  DOT = 3,
  LINE = 4,
  CIRCLE = 5,
}

interface Tag {
  label: string;
  coor: number[] | number[][];
  radius?: number;
  type: TagShape;
  data?: string;
}

interface Note {
  id: string;
  title: string;
  desc: string;
  image: string;
  tags: Tag[];
  createTime: Date;
  updateTime: Date;
}
