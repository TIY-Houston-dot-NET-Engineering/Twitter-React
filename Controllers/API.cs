using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Microsoft.EntityFrameworkCore;

[Route("/api/tweet")]
public class TweetController : CRUDController<Tweet> {
    public TweetController(IRepository<Tweet> r) : base(r){}
}
