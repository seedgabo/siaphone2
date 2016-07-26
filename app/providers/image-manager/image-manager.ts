import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {File, Transfer} from 'ionic-native';
@Injectable()
export class ImageManager {
    progress = -1;
    maximo = 100;
    constructor(public http: Http) {

    }

    downloadZip(url , loading){
        this.progress = 0;
        let fileTransfer = new Transfer();
        fileTransfer.onProgress((progressEvent)=>{
            if (progressEvent.lengthComputable)
                this.progress = Math.floor(progressEvent.loaded / progressEvent.total * 100);
        });
        fileTransfer.download(url, cordova.file.externalRootDirectory + "siasoft/imagenes.zip", true, {})
        .then((fileEntry)=>{
                console.log("download complete: " + fileEntry.toURL());
                zip.unzip(cordova.file.externalRootDirectory + "siasoft/imagenes.zip", cordova.file.externalRootDirectory + "siasoft", ()=>{
                        loading.dismiss();
                },(progressEvent)=>{
                        this.progress = Math.floor(progressEvent.loaded / progressEvent.total * 100);
                });
        })
        .catch((FileTransferError)=>{
                console.log("Error");
                loading.dismiss();
        });
    }
}
