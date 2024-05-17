import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum LoanStatus {
  Pending = 'pending',
  Borrowing = 'borrowing',
  Returning = 'returning',
  Returned = 'returned',
}

@Entity()
export class Loan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  book_id: number;

  @Column()
  start_date: Date;

  @Column()
  due_date: Date;

  @Column({
    type: 'enum',
    enum: LoanStatus,
    default: LoanStatus.Pending,
  })
  status: LoanStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
