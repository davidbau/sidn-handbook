def header(title, autotitle=True):
    global pathname
    heading = f'<h1 class="mt-5">{title}</h1>' if autotitle else ''
    return f"""\
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Structure and Interpretation of Deep Networks</title>

<!-- Bootstrap CSS Imports -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

<!-- Google Font Imports -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
rel="stylesheet">

<!-- Custom CSS Imports -->
<link rel="stylesheet" href="/css/style.css">

<!-- Mathjax -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/mml-chtml.min.js" integrity="sha512-4JUXEJCjFmGygcGTR/doRQ1Kw7uEYn+kBpiGWyVBzUQHtFSPQNm08E/lqo2/XJqiWKKV0nTpv1q8bHPPDL4n4Q==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
</head>

<body>
<nav class="navbar navbar-dark bg-dark">
<div class="container-fluid">
<ul class="navbar-nav mr-auto">
 <li class="nav-item active">
  <a class="nav-link" href="{pathname}">{title}</a>
 </li>
</ul>
<ul class="navbar-nav ml-auto">
 <li class="nav-item">
  <a class="navbar-brand" href="/">Structure and Intrepretation of Deep Networks</a>
 </li>
</ul>
</div>
</nav>

<div class="container">
<main>
{heading}
"""
