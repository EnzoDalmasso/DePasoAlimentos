namespace DePasoAlimentos.Application.Interfaces;

public interface IImageStorageService
{
    Task<string> UploadAsync(
        Stream fileStream,
        string fileName,
        string contentType,
        long fileSize,
        string folder
    );
}
