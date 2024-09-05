# sidn-handbook

The Structure and Interpretation of Deep Networks Handbook

[![CC BY-SA 4.0][cc-by-sa-shield]][cc-by-sa]

Contact David to add your github userid so you can create your page.

This work is licensed under a
[Creative Commons Attribution-ShareAlike 4.0 International License][cc-by-sa].

[![CC BY-SA 4.0][cc-by-sa-image]][cc-by-sa]

[cc-by-sa]: http://creativecommons.org/licenses/by-sa/4.0/
[cc-by-sa-image]: https://licensebuttons.net/l/by-sa/4.0/88x31.png
[cc-by-sa-shield]: https://img.shields.io/badge/License-CC%20BY--SA%204.0-lightgrey.svg

## Instructions on contributing

**Use `index.html` within a directory for your page.**
For each topic that you are contributing to, you will do your work in a single
directory. For example, when I created a handbook page on "history", I did
all my work in the subdirectory `/src/history`, and I wrote my handbook
page as `/src/history/index.html`.

**Add supporting images and code in subdirectories under each topic.**
Your page should be generously illustrated with images and links to
demonstration code that readers can run.  If you need to add images,
make sure they are compressed (please no larger than 300K per image),
and include them in the `images` subdirectory;
see the examples in `/src/history/images`.  If you need to add python
notebooks, please make them runnable in Google colab and put your
ipynb files in a `colab` subdirectory such as `/src/history/colab`.
If you copy images and programs from elsewhere, from elsewhere,
be sure to properly attribute the source - give credit to the
source in your text.

**Run `make` to generate `/public/` content.**
The concent in `/src/` is expanded through simple templates and macros
to generate the public content with some built-in navigation links.
To see any of your new content on the website, you will need to run
the template expansion scripts and then `git add public` before
doing a `git push` to see the content on the website.

## Tips on formatting your handbook page

**Start with the `{header('Your title')}` and end with `{footer()}`.**
These will be expanded by the templating system when you `make`
the website.

**Use HTML tags**.  In other words, use `<h2>` and `<h3>` etc to
create section headings, and start paragraphs with `<p>`.  Use
the `<img>` tag to insert images.  The website uses CSS based on
the Bootstrap 5 stylesheets, so those standard CSS classes are
availble if you need them. Take a look at `/src/history/index.html`
for examples.

**Use LaTeX-style MathJax for formulas**.  As you can see inside
`/src/history/index.html`, you can write math formulas using
LaTeX syntax inside your HTML by surrounding inline formulas
with `\(` and `\)`, and by surrounding block equations with
`\[` and `\]`.

**Use relative URLs.**  When you embed images, or if you need
to link to other content, avoid using absolute URLs and
instead start your URLs without a slash, like `images/pic.png`.
This will make it easier to reorganize the content later.

**Use the `{colab_link('...')}` macro.** When you
create or adapt an ipython notebook demo, go ahead and push it to
your colab subdirectory, and then link it using HTML of the form
`<a href="{colab_link('colab/example.ipynb')}">my demo</a>`.
After you `make` and push your content to the website, this
will make your notebook runnable by readers on Google Colab.




