package com.neomotion.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${storage.images}")
    private String imageFolder;

    @Value("${storage.videos}")
    private String videoFolder;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        Path imagePath = Paths.get(imageFolder).toAbsolutePath();
        Path videoPath = Paths.get(videoFolder).toAbsolutePath();

        registry.addResourceHandler("/uploads/images/**")
                .addResourceLocations("file:" + imagePath + "/");

        registry.addResourceHandler("/uploads/videos/**")
                .addResourceLocations("file:" + videoPath + "/");
    }

}
