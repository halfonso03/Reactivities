using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Resources;
using System.Threading.Tasks;
using Application.Interfaces;
using Application.Photos;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace Infrastructure.Photos
{
    public class PhotoAccessor : IPhotoAccessor
    {
        private readonly IOptions<CloudinarySettings> _config;

        public PhotoAccessor(IOptions<CloudinarySettings> config)
        {
            _config = config;
            
        }
        public async Task<PhotoUploadResult> AddPhoto(IFormFile file)
        {            
            var account = new Account(
                _config.Value.CloudName,
                _config.Value.ApiKey,
                _config.Value.ApiSecret);

            var _cloudinary = new Cloudinary(account);

            if (file.Length > 0)
            {

                await using var stream = file.OpenReadStream();
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Transformation = new Transformation().Height(500).Width(500).Crop("fill")
                };

                var uploadResult = await _cloudinary.UploadAsync(uploadParams);
                if (uploadResult.Error != null)
                {
                    throw new Exception(uploadResult.Error.Message);
                }

                return new PhotoUploadResult
                {
                    PublicId = uploadResult.PublicId,
                    Url = uploadResult.SecureUrl.ToString()
                };

            }


            return null;
        }

        public async Task<string> DeletePhoto(string publicId)
        {

            var account = new Account(
                           _config.Value.CloudName,
                           _config.Value.ApiKey,
                           _config.Value.ApiSecret);

            var _cloudinary = new Cloudinary(account);

            var deleteParams = new DeletionParams(publicId);
            var result = await _cloudinary.DestroyAsync(deleteParams);

            return result.Result == "ok" ? result.Result : null;
        }
    }
}