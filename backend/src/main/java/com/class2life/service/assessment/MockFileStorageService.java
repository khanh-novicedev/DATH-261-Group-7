package com.class2life.service.assessment;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
public class MockFileStorageService implements FileStorageService {

    // TODO: replace this mock with the MinIO SDK upload once the Leader provides the MinIO configuration
    private static final String MOCK_BASE_URL = "http://localhost:9000/class2life";

    // Keeps the final URL far below the 255-character limit of the file_url column
    private static final int MAX_FILE_NAME_LENGTH = 100;

    @Override
    public String uploadFile(MultipartFile file, String directory) {
        String fileName = sanitize(file.getOriginalFilename());
        return MOCK_BASE_URL + "/" + directory + "/" + UUID.randomUUID() + "-" + fileName;
    }

    // Replaces unsafe characters and keeps the tail of long names so the extension survives
    private static String sanitize(String originalFileName) {
        String cleaned = originalFileName == null ? "file" : originalFileName.replaceAll("[^A-Za-z0-9._-]", "_");
        if (cleaned.length() > MAX_FILE_NAME_LENGTH) {
            cleaned = cleaned.substring(cleaned.length() - MAX_FILE_NAME_LENGTH);
        }
        return cleaned;
    }
}