﻿using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DiscomfortZone.Controllers
{
    public class TicTacToeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
