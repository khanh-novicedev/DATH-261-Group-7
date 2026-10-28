package com.class2life.security;

import com.class2life.entity.user.UserRole;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoder;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.io.DecodingException;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Base64;
import java.util.Date;

@Service
public class JwtService {
    private final SecretKey secretKey;
    private final long expiration;
    public JwtService(@Value("${security.jwt.secret}") String secret, @Value("${security.jwt.expiration}") long expiration) {
        this.secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
        this.expiration = expiration;
    }

    // Create and parse token
    public String generateToken(String email, UserRole role){
        Instant now = Instant.now();

        return Jwts.builder()
                .subject(email)
                .claim("role", role.name())
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusMillis(expiration)))
                .signWith(secretKey, Jwts.SIG.HS256)
                .compact();
    }

    public Claims parseToken(String token){
        // Verifywith(secretkey) generate the Parser that verify against the secret key
        // parseSignedClaims return 3 things : aa Jws<Claims>, similar to a claimlist but wrapped inside, it contains 3 things
        // 1: Base64 -decoded header
        // 2: Base64-decoder payload
        // 3: Signature, and you call getPayload() to return the Claims that parseToken is needing
        // parseSignedToken() also does the magic: split token, decode
        // And recompute and compare the signature against secret key
        // And also check exp, if exp < now -> Throw exception
        JwtParser jwtParser = Jwts.parser().verifyWith(secretKey).build();
        Jws<Claims> claimsJws = jwtParser.parseSignedClaims(token);
        Claims claims = claimsJws.getPayload();
        return claims;
    }

}
