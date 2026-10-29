package com.class2life.service.assessment;

import org.springframework.web.multipart.MultipartFile;

// The only entry point for saving files, so the storage backend can be swapped without touching callers
public interface FileStorageService {

    /**
     * Stores the file under the given logical directory and returns its URL.
     *
     * @param file      the uploaded file
     * @param directory logical folder inside the bucket, for example "submissions/{assignmentId}"
     * @return the URL to save in the database (file_url is varchar(255))
     */
    String uploadFile(MultipartFile file, String directory);
}