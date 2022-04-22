export class RoomDto {
  id?: string;
  name?: string;
  isNew?: boolean;

  constructor(d?: RoomDto) {
    if (d) {
      this.id = d.id;
      this.name = d.name;
      this.isNew = d.isNew;
    }
  }
}
