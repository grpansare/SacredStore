package com.ecomm.app.controllers;




import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.ecomm.app.services.FileStorageService;

@RestController
@RequestMapping("/api/images") 
@CrossOrigin(origins = "http://localhost:5173") 
public class ImageUploadController {

    private final FileStorageService fileStorageService;

    public ImageUploadController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        String fileName = fileStorageService.storeFile(file);

        // Construct the file download URI (or simply return the relative path)
        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/images/") // This path needs to be exposed statically
                .path(fileName.substring(fileName.lastIndexOf("/") + 1)) // Get just the file name part
                .toUriString();

        return ResponseEntity.ok(fileDownloadUri); // Return the URL of the uploaded image
    }
}