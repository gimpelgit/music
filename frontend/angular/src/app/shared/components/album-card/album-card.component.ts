import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Album, getAlbumCoverUrl } from '../../../core/models/album.model';

@Component({
  selector: 'app-album-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './album-card.component.html',
  styleUrls: ['./album-card.component.scss']
})
export class AlbumCardComponent {
  @Input({ required: true }) album!: Album;

  protected readonly getAlbumCoverUrl = getAlbumCoverUrl;
}