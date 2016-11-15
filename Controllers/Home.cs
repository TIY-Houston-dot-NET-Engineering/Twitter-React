using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Session;
using Microsoft.AspNetCore.Http;
using System;

[Route("/")]
public class HomeController : Controller
{
    public HomeController(){}

    [HttpGet]
    public IActionResult Root(string username = "you")
    {
        return View("Empty");
    }
}