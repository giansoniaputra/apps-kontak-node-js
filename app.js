// FRAMEWORD EXPRESS
const express = require('express');
const app = express();
const port = 3000;
// VIEW ENGINE EJS
const expressLayouts = require('express-ejs-layouts');
// EXPRESS VALIDATOR
const { body, validationResult, check } = require('express-validator')
// SESSION & FLASH MESSAGE
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
// METHOD OVERRIDE (DELETE/PUT)
const methodOverride = require('method-override')
// LOAD MONGOOGE
require('./utils/connection')
const { Contact } = require('./model/contact')



//GUNAKAN EJS
app.set('view engine', 'ejs');
// Setup Method
app.use(methodOverride('_method'));
// Third Party Midleware (ejs)
app.use(expressLayouts)
// MEMBUAT FILE STATIC
app.use(express.static('public'))

//KONFIGURASI FLASH
app.use(cookieParser('secret'))
app.use(session({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(flash())

// URL ENCODED
app.use(express.urlencoded({ extended: true }))

// BASE URL
app.get('/', (req, res) => {
    const data = {
        nama: "Gian Sonia Putra",
        title: "Portfolio | Gian Sonia",
        link: [
            {
                nama: "Home",
                link: "/"
            },
            {
                nama: "About",
                link: "/about"
            },
            {
                nama: "Kontak",
                link: "/contact"
            }
        ],
        layout: 'layouts/main-layouts',
    }
    res.render('index', data)
})

// HALAMAN ABOUT
app.get('/about', (req, res) => {
    const data = {
        nama: "Gian Sonia Putra",
        title: "About | Gian Sonia",
        link: [
            {
                nama: "Home",
                link: "/"
            },
            {
                nama: "About",
                link: "/about"
            },
            {
                nama: "Kontak",
                link: "/contact"
            }
        ],
        layout: 'layouts/main-layouts',
    }
    res.render('about', data);
})

// HALAMAN KONTAK
app.get('/contact', async (req, res) => {
    const data = {
        nama: "Gian Sonia Putra",
        title: "Kontak | Gian Sonia",
        link: [
            {
                nama: "Home",
                link: "/"
            },
            {
                nama: "About",
                link: "/about"
            },
            {
                nama: "Kontak",
                link: "/contact"
            }
        ],
        layout: 'layouts/main-layouts',
        contacts: await Contact.find(),
        msg: req.flash('success')
    }
    res.render('contact', data);
})

// HALAMAN FORM DATA KONTAK
app.get('/contact/add', (req, res) => {
    const data = {
        nama: "Gian Sonia Putra",
        title: "Tambah Kontak | Gian Sonia",
        link: [
            {
                nama: "Home",
                link: "/"
            },
            {
                nama: "About",
                link: "/about"
            },
            {
                nama: "Kontak",
                link: "/contact"
            }
        ],
        layout: 'layouts/main-layouts',
    }
    res.render('contact-add', data);
})

// PROSESS SIMPAN KONTAK
app.post('/contact', [
    body('nama').custom(async (value) => {
        const duplikat = await Contact.findOne({ nama: value });
        if (duplikat) {
            throw new Error('Nama Kontak Sudah Terdaftar!')
        } else {
            return true;
        }
    }),
    check('email', 'Email Tidak Valid!').isEmail(),
    check('noHP', 'Nomor HP Tidak Valid!').isMobilePhone('id-ID')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const data = {
            nama: "Gian Sonia Putra",
            title: "Tambah Kontak | Gian Sonia",
            link: [
                {
                    nama: "Home",
                    link: "/"
                },
                {
                    nama: "About",
                    link: "/about"
                },
                {
                    nama: "Kontak",
                    link: "/contact"
                }
            ],
            layout: 'layouts/main-layouts',
            errors: errors.array()
        }
        res.render('contact-add', data);
    } else {
        const data = new Contact(req.body)

        // Simpan
        data.save()
        // kirimkan flash message
        req.flash('success', 'Data Kontak Berhasil Ditambahkan!')
        res.redirect('/contact')
    }
})

// DETAIL KONTAK
app.get('/contact/:id', async (req, res) => {
    const data = {
        nama: "Gian Sonia Putra",
        title: "Kontak | Gian Sonia",
        link: [
            {
                nama: "Home",
                link: "/"
            },
            {
                nama: "About",
                link: "/about"
            },
            {
                nama: "Kontak",
                link: "/contact"
            }
        ],
        layout: 'layouts/main-layouts',
        contact: await Contact.findOne({ _id: req.params.id }),
    }
    res.render('detail-contact', data);
})

// HAPUS DATA KONTAK
app.delete('/contact', async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.body.id);
        req.flash('success', 'Data Kontak Berhasil Dihapus!')
        res.redirect('/contact')
    } catch (err) {
        res.status(404);
        res.send("Halaman Tidak Tersedia<br><a href='/contact'><< Kembali ke halaman Contact</a>");
    }
})

// HALAMAN FORM EDIT KONTAK
app.get('/contact/edit/:id', async (req, res) => {
    const contact = await Contact.findOne({ _id: req.params.id });
    const data = {
        nama: "Gian Sonia Putra",
        title: "Tambah Kontak | Gian Sonia",
        link: [
            {
                nama: "Home",
                link: "/"
            },
            {
                nama: "About",
                link: "/about"
            },
            {
                nama: "Kontak",
                link: "/contact"
            }
        ],
        layout: 'layouts/main-layouts',
        contact: contact
    }
    res.render('contact-edit', data);
})

// PROSES UPDATE KONTAK
app.put('/contact/:id', [
    body('nama').custom(async (value, { req }) => {
        const duplikat = await Contact.findOne({ nama: value });
        if (duplikat && duplikat.nama !== req.body.oldNama) {
            throw new Error('Nama Kontak Sudah Terdaftar!')
        } else {
            return true;
        }
    }),
    check('email', 'Email Tidak Valid!').isEmail(),
    check('noHP', 'Nomor HP Tidak Valid!').isMobilePhone('id-ID')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.body._id = req.params.id
        const data = {
            nama: "Gian Sonia Putra",
            title: "Tambah Kontak | Gian Sonia",
            link: [
                {
                    nama: "Home",
                    link: "/"
                },
                {
                    nama: "About",
                    link: "/about"
                },
                {
                    nama: "Kontak",
                    link: "/contact"
                }
            ],
            layout: 'layouts/main-layouts',
            errors: errors.array(),
            contact: req.body
        }
        res.render('contact-edit', data);
    } else {
        delete req.body.oldNama
        await Contact.updateOne(
            { _id: req.params.id },
            {
                $set: req.body
            })
        req.flash('success', 'Data Kontak Berhasil Diubah!')
        res.redirect('/contact')
    }
})

// HALAMAN FORM EDIT KONTAK
app.get('/contact/:id', async (req, res) => {
    const contact = await Contact.findOne({ _id: req.params.id });
    const data = {
        nama: "Gian Sonia Putra",
        title: "Tambah Kontak | Gian Sonia",
        link: [
            {
                nama: "Home",
                link: "/"
            },
            {
                nama: "About",
                link: "/about"
            },
            {
                nama: "Kontak",
                link: "/contact"
            }
        ],
        layout: 'layouts/main-layouts',
        contact: contact
    }
    res.render('contact-edit', data);
})

// RAOUTE 404
app.use('/', (req, res) => {
    res.status(404)
    res.send('Test')
})


// JALANKAN SERVER
app.listen(port, () => {
    console.log(`Listening on port http://localhost:${port}`);
})
