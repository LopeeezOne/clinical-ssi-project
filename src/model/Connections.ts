import {Entity, Column, BaseEntity, PrimaryGeneratedColumn} from 'typeorm';

@Entity('connections')
export class Connection extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column('datetime') createdAt: Date;
  @Column('text') alias_created: string;
  @Column('text') alias_received: string;
  @Column('text') did_created: string;
  @Column('text') did_received: string;
}