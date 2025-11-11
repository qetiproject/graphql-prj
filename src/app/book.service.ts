import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class BooksService {
  private apollo = inject(Apollo);

  getBooks() {
    return this.apollo.watchQuery({
      query: gql`
        query {
          posts(options: { paginate: { page: 1, limit: 5 } }) {
            data {
              id
              title
              body
            }
          }
        }
      `,
    }).valueChanges.pipe(map((res: any) => res.data.posts.data));
  }

  addBook(title: string, body: string) {
    return this.apollo.mutate({
      mutation: gql`
        mutation ($input: CreatePostInput!) {
          createPost(input: $input) {
            id
            title
            body
          }
        }
      `,
      variables: { input: { title, body } },
    });
  }

  deleteBook(id: string) {
    return this.apollo.mutate({
      mutation: gql`
        mutation ($id: ID!) {
          deletePost(id: $id)
        }
      `,
      variables: { id },
    });
  }
}
