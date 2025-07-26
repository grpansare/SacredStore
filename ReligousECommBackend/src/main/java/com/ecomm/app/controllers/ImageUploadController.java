package com.ecomm.app.controllers;




import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.ecomm.app.services.FileStorageService;

@RestController
@RequestMapping("/api/images") 

public class ImageUploadController {

    private final FileStorageService fileStorageService;

    public ImageUploadController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
    	 String imageUrl = fileStorageService.uploadProductImage(file);
    	    return ResponseEntity.ok(imageUrl);
    }
}
