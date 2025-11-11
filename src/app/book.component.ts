import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BooksService } from './book.service';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2>📚 Books (GraphQL CRUD)</h2>

    <form [formGroup]="form" (ngSubmit)="onAdd()" class="flex gap-2 mb-4">
      <input placeholder="Title" formControlName="title" class="border p-2">
      <input placeholder="Body" formControlName="body" class="border p-2">
      <button type="submit" class="bg-blue-500 text-white px-3 py-1 rounded">Add</button>
    </form>

    <ul>
      <li *ngFor="let book of books()">
        <b>{{ book.title }}</b> — {{ book.body }}
        <button (click)="onDelete(book.id)" class="ml-2 text-red-500">Delete</button>
      </li>
    </ul>
  `
})
export class BooksComponent implements OnInit {
  private fb = inject(FormBuilder);
  private booksService = inject(BooksService);

  books = signal<any[]>([]);

  form = this.fb.group({
    title: '',
    body: '',
  });

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.booksService.getBooks().subscribe(data => this.books.set(data));
  }

  onAdd() {
    const { title, body } = this.form.value;
    this.booksService.addBook(title!, body!).subscribe(() => {
      this.form.reset();
      this.loadBooks();
    });
  }

  onDelete(id: string) {
    this.booksService.deleteBook(id).subscribe(() => this.loadBooks());
  }
}
