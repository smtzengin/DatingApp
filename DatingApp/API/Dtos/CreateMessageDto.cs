using System;

namespace API.Dtos;

public class CreateMessageDto
{
    public required string RecipientUsername { get; set; }
    public required string Content { get; set; }
}
