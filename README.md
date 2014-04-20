mdwiki-gimmicks
===============

[Gimmicks(a.k.a. plugins)](http://dynalon.github.io/mdwiki/#!gimmicks.md) I've written for MDwiki(https://github.com/Dynalon/mdwiki)

Rationale
-----------

Thanks to @Dynalon 's MDWiki, I've been using it in my team for knowledge sharing and precipitation, I've written [an editor](https://github.com/utensil/mdwiki-editor) for it too, to edit it and to preview it easily without a http server environment.

Now and then, I would need to share something more complicated: tables, slides, UML diagrams, charts, timelines and so on. Markdown is powerful and extensible, but not designed for rich content like this. In the editor, I've add the functionality to paste in already taken screen-shots, so images can be easily added.

Linking to rich contents is not what I want. These rich content should be able to:

* directly show on the wiki, instead of requiring downloading
* be plain text editable thus `diff`-able in version control systems, instead of editing externally by other software if possible

I've written a few gimmicks to do so, and a few planning. They would introduce external dependencies thus not appropriate to be included in MDWiki itself.


Development Status
----------------------

Early stage.

Available Gimmicks
--------------------

Planned Gimmicks
--------------------

License
-----------------

MIT License, see LICENSE. Copyright (c) 2014 Utensil Song (https://github.com/utensil)


