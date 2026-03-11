import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Playlist, getPlaylistCoverUrl } from '../../../core/models/playlist.model';

@Component({
  selector: 'app-playlist-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './playlist-card.component.html'
})
export class PlaylistCardComponent {
  @Input({ required: true }) playlist!: Playlist;

  protected readonly getPlaylistCoverUrl = getPlaylistCoverUrl;
}