package com.class2life;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.TimeZone;

@SpringBootApplication
public class BackendApplication {

    static {
        // The JDBC driver sends the JVM default zone as the connection's TimeZone.
        // On Windows, Vietnam reports the deprecated alias "Asia/Saigon", which
        // current Postgres tz databases reject (SQLSTATE 22023). Pin the canonical
        // zone so startup does not depend on the machine's OS time-zone table.
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
    }

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

}
