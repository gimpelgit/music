import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Album } from '../../../core/models/album.model';

@Component({
  selector: 'app-album-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './album-card.component.html',
  styleUrls: ['./album-card.component.scss']
})
export class AlbumCardComponent {
  @Input({ required: true }) album!: Album;

  getCoverImage(): string {
    if (this.album.coverImageUrl) {
      if (this.album.coverImageUrl.startsWith('http')) {
        return this.album.coverImageUrl;
      }
      return 'http://localhost:8080' + this.album.coverImageUrl;
    }
    return 'https://via.placeholder.com/300x300?text=No+Cover';
  }
}