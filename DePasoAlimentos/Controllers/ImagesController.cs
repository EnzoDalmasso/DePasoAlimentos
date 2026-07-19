using DePasoAlimentos.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DePasoAlimentos.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class ImagesController : ControllerBase
{
    private readonly IImageStorageService _imageStorageService;
    private readonly ILogger<ImagesController> _logger;

    public ImagesController(
        IImageStorageService imageStorageService,
        ILogger<ImagesController> logger
    )
    {
        _imageStorageService = imageStorageService;
        _logger = logger;
    }

    [HttpPost("upload")]
    [RequestSizeLimit(5 * 1024 * 1024)]
    public async Task<ActionResult<UploadImageResponse>> Upload(
        IFormFile? file,
        [FromForm] string folder
    )
    {
        try
        {
            if (file is null)
            {
                return BadRequest(new { message = "Tenes que seleccionar una imagen." });
            }

            await using var fileStream = file.OpenReadStream();
            var imageUrl = await _imageStorageService.UploadAsync(
                fileStream,
                file.FileName,
                file.ContentType,
                file.Length,
                folder
            );

            return Ok(new UploadImageResponse(imageUrl));
        }
        catch (ArgumentException exception)
        {
            return BadRequest(new { message = exception.Message });
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "No se pudo subir la imagen.");

            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new { message = "No pudimos subir la imagen." }
            );
        }
    }
}

public record UploadImageResponse(string ImageUrl);
