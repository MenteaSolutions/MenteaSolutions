import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-dialog-zoom',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './dialog-zoom.component.html',
  styleUrl: './dialog-zoom.component.css'
})
export class DialogZoomComponent {
  iframeUrl!: SafeResourceUrl;
  constructor(public dialogRef: MatDialogRef<DialogZoomComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private sanitizer: DomSanitizer) {
    this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data.iframeUrl);
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
