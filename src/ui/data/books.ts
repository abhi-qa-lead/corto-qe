export const BOOKS = [
  { isbn: '9781449325862', title: 'Git Pocket Guide', author: 'Richard E. Silverman', publisher: "O'Reilly Media" },
  { isbn: '9781449331818', title: 'Learning JavaScript Design Patterns', author: 'Addy Osmani', publisher: "O'Reilly Media" },
  { isbn: '9781449337711', title: 'Designing Evolvable Web APIs with ASP.NET', author: 'Glenn Block et al.', publisher: "O'Reilly Media" },
  { isbn: '9781449365035', title: 'Speaking JavaScript', author: 'Axel Rauschmayer', publisher: "O'Reilly Media" },
  { isbn: '9781491904244', title: "You Don't Know JS", author: 'Kyle Simpson', publisher: "O'Reilly Media" },
  { isbn: '9781491950296', title: 'Programming JavaScript Applications', author: 'Eric Elliott', publisher: "O'Reilly Media" },
  { isbn: '9781593275846', title: 'Eloquent JavaScript, Second Edition', author: 'Marijn Haverbeke', publisher: 'No Starch Press' },
  { isbn: '9781593277574', title: 'Understanding ECMAScript 6', author: 'Nicholas C. Zakas', publisher: 'No Starch Press' },
] as const;

export const TOTAL_BOOKS = BOOKS.length;
