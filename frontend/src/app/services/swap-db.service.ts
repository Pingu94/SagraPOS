import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SwapDBService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  downloadFile(): void {
    this.http.get(this.baseUrl + 'DownloadDB', { responseType: 'blob' })
      .subscribe(blob => {
        this.downloadBlob(blob, 'SagraPOS.sqlite3');
      });
  }

  private downloadBlob(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.download = filename;
    anchor.href = url;
    anchor.click();
    window.URL.revokeObjectURL(url);
  }
}
