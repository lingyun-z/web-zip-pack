import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'zip-app';
  fileName = null;
  readFiles = 0;
  files = [];
  percent = '0';
  showFinishMsg = false;
  showFileNameMsg = false;
  showFileCountMsg = false;
  packButtonDisable = false;

  ngOnInit() {}

  initData() {
    this.files = [];
    this.readFiles = 0;
    this.percent = '0';
    this.showFileNameMsg = false;
    this.showFileCountMsg = false;
    this.packButtonDisable = false;
    this.showFinishMsg = true;
    setTimeout(() => {
      this.showFinishMsg = false;
    }, 5000);
  }

  valid() {
    if (!this.fileName || !this.fileName.trim()) {
      this.showFileNameMsg = true;
      return false;
    }
    if (this.files.length === 0) {
      this.showFileCountMsg = true;
      return false;
    }
    return true;
  }

  uploadFiles(event) {
    const files = event.target.files;
    this.files = [...this.files, ...Array.from(files)];
  }

  pack() {
    if (this.valid()) {
      this.packButtonDisable = true;
      const getFileDataList = [];
      this.files.forEach((file: any) => {
        getFileDataList.push(this.getFileData(file));
      });
      Promise.all(getFileDataList).then((fileDataList) => {
        this.packFile(fileDataList);
      });
    }
  }

  getFileData(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.readFiles++;
        resolve({ name: file.name, blob: e.target.result });
      };
      reader.readAsArrayBuffer(file);
    });
  }

  packFile(fileDataList) {
    const zip = new JSZip();
    fileDataList.forEach(({ name, blob }) => {
      zip.file(name, blob, { binary: true });
    });
    zip
      .generateAsync({ type: 'blob' }, (metadata) => {
        this.percent = metadata.percent.toFixed(2);
      })
      .then((blob) => {
        saveAs(blob, this.fileName);
        this.initData();
      });
  }
}
