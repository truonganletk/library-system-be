import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum BookStatus {
  Available = 'available',
  CheckedOut = 'checked out',
  Maintenance = 'maintenance',
  Lost = 'lost',
}

@Entity()
export class Book {
  // Unique identifier for each book entry
  @PrimaryGeneratedColumn()
  id: number;

  // Title of the book
  @Column({ length: 500 })
  title: string;

  // Author of the book
  @Column({ length: 255 })
  author: string;

  // Publisher of the book
  @Column({ length: 255, nullable: true })
  publisher: string;

  // Publication year of the book
  @Column()
  year: number;

  // Description of the book
  @Column({ nullable: true })
  description: string;

  // Genre of the book
  @Column({ length: 255, nullable: true })
  genre: string;

  // Current status of the book, using the BookStatus enum
  @Column({ type: 'enum', enum: BookStatus, default: BookStatus.Available })
  status: BookStatus;
}
