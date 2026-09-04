package com.neomotion.service;

import com.neomotion.dto.NewsRequestDTO;
import com.neomotion.dto.NewsResponseDTO;
import com.neomotion.entity.News;
import com.neomotion.exception.ResourceNotFoundException;
import com.neomotion.repository.NewsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NewsServiceImpl
        implements NewsService {

    private final NewsRepository newsRepository;


    public NewsServiceImpl(
            NewsRepository newsRepository) {

        this.newsRepository =
                newsRepository;
    }


    @Override
    public List<NewsResponseDTO> findPublic() {

        return newsRepository
                .findByActiveTrueOrderByPublishedAtDesc()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }


    @Override
    public List<NewsResponseDTO> findAll() {

        return newsRepository
                .findAllByOrderByPublishedAtDesc()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }


    @Override
    public NewsResponseDTO findById(
            Long id) {

        News news =
                newsRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Noticia no encontrada."
                                )
                        );

        return toResponseDTO(news);
    }


    @Override
    public NewsResponseDTO save(
            NewsRequestDTO request) {

        News news =
                new News();

        applyRequest(
                news,
                request
        );

        News saved =
                newsRepository.save(news);

        return toResponseDTO(saved);
    }


    @Override
    public NewsResponseDTO update(
            Long id,
            NewsRequestDTO request) {

        News news =
                newsRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Noticia no encontrada."
                                )
                        );

        applyRequest(
                news,
                request
        );

        News updated =
                newsRepository.save(news);

        return toResponseDTO(updated);
    }


    @Override
    public void deleteById(
            Long id) {

        if (!newsRepository.existsById(id)) {

            throw new ResourceNotFoundException(
                    "Noticia no encontrada."
            );
        }

        newsRepository.deleteById(id);
    }


    private void applyRequest(
            News news,
            NewsRequestDTO request) {

        news.setTitle(
                request.getTitle()
        );

        news.setCategory(
                request.getCategory()
        );

        news.setContent(
                request.getContent()
        );

        news.setImageUrl(
                request.getImageUrl()
        );

        news.setPublishedAt(
                request.getPublishedAt()
        );

        news.setActive(
                request.getActive()
        );
    }


    private NewsResponseDTO toResponseDTO(
            News news) {

        NewsResponseDTO response =
                new NewsResponseDTO();

        response.setId(
                news.getId()
        );

        response.setTitle(
                news.getTitle()
        );

        response.setCategory(
                news.getCategory()
        );

        response.setContent(
                news.getContent()
        );

        response.setImageUrl(
                news.getImageUrl()
        );

        response.setPublishedAt(
                news.getPublishedAt()
        );

        response.setActive(
                news.getActive()
        );

        return response;
    }
}