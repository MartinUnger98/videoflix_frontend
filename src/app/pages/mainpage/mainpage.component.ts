import { Component, inject, OnInit } from '@angular/core';
import { GenreService } from '../../services/genre.service';
import { Genre } from '../../utils/genre.utils';

@Component({
  selector: 'app-mainpage',
  imports: [],
  templateUrl: './mainpage.component.html',
  styleUrl: './mainpage.component.scss',
})
export class MainpageComponent implements OnInit {
  genres: Genre[] = [];
  genreService = inject(GenreService);

  ngOnInit(): void {
    this.genreService.getGenres().subscribe({
      next: (response) => {
        this.genres = response;
      },
      error: (error) => {
        console.error('Error fetching genres:', error);
      },
    });
  }
}
