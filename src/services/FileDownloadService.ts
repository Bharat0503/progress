// import * as FileSystem from 'expo-file-system';
// import * as Network from 'expo-network';
// import { Alert } from 'react-native';
// import alert from '../utils/alert';

// interface DownloadedFile {
//     id: string;
//     name: string;
//     uri: string;
//     type: 'image' | 'video' | 'pdf';
//     downloadDate: number;
// }

// class FileDownloadService {
//     private static DOWNLOAD_DIRECTORY = FileSystem?.documentDirectory + 'downloads/';

//     // Ensure download directory exists
//     static async initializeDownloadDirectory() {
//         const dirInfo = await FileSystem?.getInfoAsync(this.DOWNLOAD_DIRECTORY);
//         if (!dirInfo.exists) {
//             await FileSystem?.makeDirectoryAsync(this.DOWNLOAD_DIRECTORY, { intermediates: true });
//         }
//     }

//     // Check internet connection
//     static async checkInternetConnection() {
//         const networkState = await Network?.getNetworkStateAsync();
//         return networkState?.isConnected;
//     }

//     static getExtension(type: 'image' | 'video' | 'pdf'): string {
//         const typeMap: Record<'image' | 'video' | 'pdf', string> = {
//             image: 'png',
//             video: 'mp4',
//             pdf: 'pdf',
//         };
//         return typeMap[type];
//     }

//     // Generate unique filename without duplicate extension
//     static generateUniqueFileName(originalName: string, type: 'image' | 'video' | 'pdf') {
//         const timestamp = Date.now();
//         const id = `${timestamp}`;
//         const extension = this.getExtension(type);
//         return `${id}_${originalName}.${extension}`;
//     }


//     // Download file with progress tracking
//     static async downloadFile(
//         url: string,
//         type: 'image' | 'video' | 'pdf',
//         originalName: string,
//         onProgress?: (progress: number) => void
//     ): Promise<DownloadedFile | null> {
//         // Check internet connection first
//         const isConnected = await this.checkInternetConnection();
//         if (!isConnected) {
//             alert('No Internet', 'Please check your internet connection and try again.');
//             return null;
//         }

//         // Ensure download directory exists
//         await this.initializeDownloadDirectory();

//         // Generate unique filename
//         const fileName = this.generateUniqueFileName(originalName, type);
//         const fileUri = this.DOWNLOAD_DIRECTORY + fileName;

//         try {
//             const downloadResumable = FileSystem?.createDownloadResumable(
//                 url,
//                 fileUri,
//                 {},
//                 (downloadProgress) => {
//                     const progress = downloadProgress?.totalBytesWritten / downloadProgress?.totalBytesExpectedToWrite;
//                     onProgress?.(progress * 100);
//                 }
//             );

//             const { uri } = await downloadResumable?.downloadAsync() || {};

//             if (!uri) {
//                 alert('Download Failed', 'Unable to download the file.');
//                 return null;
//             }

//             // Create download record
//             const downloadedFile: DownloadedFile = {
//                 id: fileName?.split('_')[0],
//                 name: originalName,
//                 uri: uri,
//                 type: type,
//                 downloadDate: Date.now()
//             };

//             return downloadedFile;

//         } catch (error) {
//             console.error('Download error:', error);
//             alert('Download Error', 'Failed to download the file.');
//             return null;
//         }
//     }

//     // Retrieve all downloaded files
//     static async getAllDownloadedFiles(): Promise<DownloadedFile[]> {
//         try {
//             await this.initializeDownloadDirectory();
//             const files = await FileSystem?.readDirectoryAsync(this.DOWNLOAD_DIRECTORY);

//             const downloadedFiles: DownloadedFile[] = files?.map(fileName => {
//                 const [id, originalName] = fileName?.split('_');
//                 const type = fileName?.includes('.pdf') ? 'pdf'
//                     : fileName?.includes('.mp4') ? 'video'
//                         : 'image';

//                 return {
//                     id: id,
//                     name: originalName?.split('.')[0],
//                     uri: this.DOWNLOAD_DIRECTORY + fileName,
//                     type: type,
//                     downloadDate: parseInt(id)
//                 };
//             });

//             return downloadedFiles;
//         } catch (error) {
//             console.error('Error retrieving downloaded files:', error);
//             return [];
//         }
//     }

//     // Delete a specific downloaded file
//     static async deleteDownloadedFile(fileId: string): Promise<boolean> {
//         try {
//             const files = await this.getAllDownloadedFiles();
//             const fileToDelete = files?.find(file => file.id === fileId);

//             if (!fileToDelete) {
//                 alert('File Not Found', 'The specified file could not be found.');
//                 return false;
//             }

//             await FileSystem?.deleteAsync(fileToDelete.uri);
//             return true;
//         } catch (error) {
//             console.error('Delete file error:', error);
//             alert('Delete Failed', 'Unable to delete the file.');
//             return false;
//         }
//     }

//     // Delete all downloaded files
//     static async deleteAllDownloadedFiles(): Promise<boolean> {
//         try {
//             await FileSystem?.deleteAsync(this.DOWNLOAD_DIRECTORY, { idempotent: true });
//             await this.initializeDownloadDirectory();
//             return true;
//         } catch (error) {
//             console.error('Delete all files error:', error);
//             alert('Delete Failed', 'Unable to delete all files.');
//             return false;
//         }
//     }
// }

// export default FileDownloadService;































import * as FileSystem from 'expo-file-system';
import * as Network from 'expo-network';
import { Alert, Platform } from 'react-native';
import alert from '../utils/alert';

interface DownloadedFile {
    id: string;
    name: string;
    uri: string;
    type: 'image' | 'video' | 'pdf';
    downloadDate: number;
}

class FileDownloadService {
    private static DOWNLOAD_DIRECTORY = FileSystem?.documentDirectory + 'downloads/';
    private static isDownloading: boolean = false;
    // Ensure download directory exists (Only for Mobile)
    static async initializeDownloadDirectory() {
        if (Platform.OS === 'web') return;
        const dirInfo = await FileSystem?.getInfoAsync(this.DOWNLOAD_DIRECTORY);
        if (!dirInfo.exists) {
            await FileSystem?.makeDirectoryAsync(this.DOWNLOAD_DIRECTORY, { intermediates: true });
        }
    }
    private static async doesFileExist(fileUri: string): Promise<boolean> {
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        return fileInfo.exists;
    }

    // Check internet connection
    static async checkInternetConnection() {
        if (Platform.OS === 'web') return navigator.onLine;
        const networkState = await Network?.getNetworkStateAsync();
        return networkState?.isConnected;
    }

    static getExtension(type: 'image' | 'video' | 'pdf'): string {
        const typeMap: Record<'image' | 'video' | 'pdf', string> = {
            image: 'png',
            video: 'mp4',
            pdf: 'pdf',
        };
        return typeMap[type];
    }

    // Generate unique filename without duplicate extension
    static generateUniqueFileName(originalName: string, type: 'image' | 'video' | 'pdf') {
        const timestamp = Date.now();
        const id = `${timestamp}`;
        const extension = this.getExtension(type);
        return `${id}_${originalName}.${extension}`;
    }

    static async downloadFile(
        url: string,
        type: 'image' | 'video' | 'pdf',
        originalName: string,
        onProgress?: (progress: number) => void
    ): Promise<DownloadedFile | null> {
        const isConnected = await this.checkInternetConnection();
        if (!isConnected) {
            alert('No Internet', 'Please check your internet connection and try again.');
            return null;
        }

        if (this.isDownloading) {
            alert('Download in Progress', 'Please wait for the current download to finish.');
            return null;
        }

        this.isDownloading = true;
    
        if (Platform.OS === 'web') {
            let storedFiles = JSON.parse(localStorage.getItem('downloadedFiles') || '[]');
    
            // ✅ Check if file already exists before adding
            const existingFile = storedFiles.find((file: DownloadedFile) => file.name === originalName);
            if (existingFile) {
                alert('Already Downloaded', 'This file is already in your downloads.');
                this.isDownloading = false;
                return existingFile;
            }
    
            const newFile: DownloadedFile = {
                id: Date.now().toString(),
                name: originalName,
                uri: url,
                type: type,
                downloadDate: Date.now(),
            };
    
            storedFiles.push(newFile);
            localStorage.setItem('downloadedFiles', JSON.stringify(storedFiles));
    
            alert('Saved', 'File metadata saved.');
            this.isDownloading = false;
            return newFile;
        }
    
        await this.initializeDownloadDirectory();
        const fileName = this.generateUniqueFileName(originalName, type);
        const fileUri = this.DOWNLOAD_DIRECTORY + fileName;

        const fileExists = await this.doesFileExist(fileUri);
        if (fileExists) {
            Alert.alert('Already Downloaded', 'This file is already in your downloads.');
            this.isDownloading = false;
            return {
                id: fileName.split('_')[0],
                name: originalName,
                uri: fileUri,
                type: type,
                downloadDate: Date.now(),
            };
        }
    
        try {
            const downloadResumable = FileSystem?.createDownloadResumable(
                url,
                fileUri,
                {},
                (downloadProgress) => {
                    const progress = downloadProgress?.totalBytesWritten / downloadProgress?.totalBytesExpectedToWrite;
                    onProgress?.(progress * 100);
                }
            );
    
            const { uri } = await downloadResumable?.downloadAsync() || {};
            if (!uri) {
                alert('Download Failed', 'Unable to download the file.');
                this.isDownloading = false;
                return null;
            }
    
            const downloadedFile: DownloadedFile = {
                id: fileName?.split('_')[0],
                name: originalName,
                uri: uri,
                type: type,
                downloadDate: Date.now(),
            };
            this.isDownloading = false;
            return downloadedFile;
        } catch (error) {
            console.error('Download error:', error);
            alert('Download Error', 'Failed to download the file.');
            this.isDownloading = false;
            return null;
        }
    }
    
    

    // Retrieve all downloaded files
    static async getAllDownloadedFiles(): Promise<DownloadedFile[]> {
        if (Platform.OS === 'web') {
            const storedFiles = localStorage.getItem('downloadedFiles');
            return storedFiles ? JSON.parse(storedFiles) : [];
        }

        try {
            await this.initializeDownloadDirectory();
            const files = await FileSystem?.readDirectoryAsync(this.DOWNLOAD_DIRECTORY);

            const downloadedFiles: DownloadedFile[] = files?.map(fileName => {
                const [id, originalName] = fileName?.split('_');
                const type = fileName?.includes('.pdf') ? 'pdf'
                    : fileName?.includes('.mp4') ? 'video'
                        : 'image';

                return {
                    id: id,
                    name: originalName?.split('.')[0],
                    uri: this.DOWNLOAD_DIRECTORY + fileName,
                    type: type,
                    downloadDate: parseInt(id),
                };
            });

            return downloadedFiles;
        } catch (error) {
            console.error('Error retrieving downloaded files:', error);
            return [];
        }
    }

    // Delete a specific downloaded file
    static async deleteDownloadedFile(fileId: string): Promise<boolean> {
        if (Platform.OS === 'web') {
            const storedFiles = await this.getAllDownloadedFiles();
            const updatedFiles = storedFiles.filter(file => file.id !== fileId);
            localStorage.setItem('downloadedFiles', JSON.stringify(updatedFiles));
            return true;
        }

        try {
            const files = await this.getAllDownloadedFiles();
            const fileToDelete = files?.find(file => file.id === fileId);

            if (!fileToDelete) {
                alert('File Not Found', 'The specified file could not be found.');
                return false;
            }

            await FileSystem?.deleteAsync(fileToDelete.uri);
            return true;
        } catch (error) {
            console.error('Delete file error:', error);
            alert('Delete Failed', 'Unable to delete the file.');
            return false;
        }
    }

    // Delete all downloaded files
    static async deleteAllDownloadedFiles(): Promise<boolean> {
        if (Platform.OS === 'web') {
            localStorage.removeItem('downloadedFiles');
            return true;
        }

        try {
            await FileSystem?.deleteAsync(this.DOWNLOAD_DIRECTORY, { idempotent: true });
            await this.initializeDownloadDirectory();
            return true;
        } catch (error) {
            console.error('Delete all files error:', error);
            alert('Delete Failed', 'Unable to delete all files.');
            return false;
        }
    }
}

export default FileDownloadService;
