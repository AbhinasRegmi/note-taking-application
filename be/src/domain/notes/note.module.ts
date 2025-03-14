import { Module } from "@nestjs/common";
import { NotesController } from "./note.controller";
import { NoteService } from "./note.service";

@Module({
  controllers: [NotesController],
  providers: [NoteService],
  exports: [],
})
export class NoteModule {}