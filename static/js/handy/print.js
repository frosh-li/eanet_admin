function printPartOfDocument() {
    this.init.apply(this, arguments);
}

printPartOfDocument.prototype = {
    init: function(o, part) {
        this.o = this.getId(o);
        this.part = this.getId(part);
        this.frame = '';
        this.printCss = '';
        var _this = this;
        this.addEvent(this.o, 'click',
        function() {
            _this.create();
        });
    },
    create: function() {
        var _this = this;
        if (!this.frame) {
            var oFrame = document.createElement('iframe');
            oFrame.setAttribute('id', 'printIframe');
            oFrame.style.position = 'absolute';
            oFrame.style.left = '-9999px';
            document.body.appendChild(oFrame);
        }
        if (!this.printCss) this.printCss = this.getPrintCss();
        setTimeout(function() {
            _this.frame = document.getElementById('printIframe'),
            d = _this.frame.contentWindow.document,
            h = d.getElementsByTagName('head')[0],
            b = d.getElementsByTagName('body')[0];
            for (var i = 0; i < _this.printCss.length; i++) {
                h.appendChild(_this.printCss[i]);
            }
            b.innerHTML = '';
            b.appendChild(_this.part.cloneNode(true));
            _this.frame.contentWindow.print();
        },
        0);
    },
    getPrintCss: function() {
        var styles = document.getElementsByTagName('head')[0].getElementsByTagName('link'),
        printCss = [];
        for (var i = 0; i < styles.length; i++) {
            var attr = styles[i].getAttribute('media');
            if (attr == 'all' || attr == 'print') printCss.push(styles[i].cloneNode(true));
        }
        return printCss;
    },
    getId: function(el) {
        return typeof el == 'string' ? document.getElementById(el) : el;
    },
    addEvent: function(o, type, fn) {
        if (o.addEventListener) {
            o.addEventListener(type, fn, false);
        } else if (o.attachEvent) {
            o.attachEvent('on' + type,
            function() {
                fn.call(o, window.event);
            });
        }
    }
};