// Do your work here...
function get_item(key) {
	// Dari string json ke object
	return JSON.parse( localStorage.getItem( key ) );
}
function get_all_data( option = "all" ) {
	let data = [];
	let keys = Object.keys(localStorage);
	for (var i = 0; i < keys.length; i++) {
		let key = keys[i];
		let data_row = get_item( key );
		if ( option == "complete" ) {
			// Masukkan data yang isCompletenya true, yaitu buku sudah selesai dibaca
			if ( data_row.isComplete == true ) {
				data.push( data_row );
			}
		}else if ( option == "not_complete") {
			// Masukkan data yang isCompletenya false, yaitu buku belum selesai dibaca
			if ( data_row.isComplete == false ) {
				data.push( data_row );
			}
		}else{
			//Jika yang ditampilkan semua data 
			data.push( data_row );
		}
	}
	return data;
}

// Fungsi untuk menambahkan data ke Local Storage
function addBookToLocalStorage(id, title, author, year, isComplete) {
	// Cek apakah data sudah ada di Local Storage
	// Buat objek data buku baru
	let book = {
		id: id,
		title: title,
		author: author,
		year: year,
		isComplete: isComplete
	};

	// Simpan array books kembali ke Local Storage
	// Dari object ke string json
	localStorage.setItem( id , JSON.stringify(book));

	alert_modal('Buku berhasil ditambahkan')

	console.log('Buku berhasil ditambahkan ke Local Storage:')

}

function update_status( key, nilai_baru ) {
	// Cek apakah data sudah ada di Local Storage
	// Buat objek data buku baru

	var row_baru = get_item(key);
	row_baru.isComplete = nilai_baru;

	// Simpan array books kembali ke Local Storage
	// Dari object ke string json
	localStorage.setItem( key , JSON.stringify(row_baru));

	refresh_page();
	console.log('Buku berhasil diupdate ke Local Storage:')
}






var data_complete = []
var data_incomplete = []



function create_el( row_data ) {

	let book = {
		id: row_data.id,
		title: row_data.title,
		author: row_data.author,
		year: row_data.year,
	};


	let status;
	if ( row_data.isComplete == true ) {
		status = "Belum Dibaca";
	}else{
		status = "Selesai Dibaca";

	}


	var el = `
	<div class="book_item" data-key="${book.id}" data-testid="bookItem">
	<h3 data-testid="bookItemTitle">${book.title}</h3>
	<p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
	<p data-testid="bookItemYear">Tahun: ${book.year}</p>
	<div>
	<button class="update_status" data-testid="bookItemIsCompleteButton">${status}</button>
	<button class = "btn_hapus" data-testid="bookItemEditButton">Hapus Buku</button>
	</div>
	</div>
	`;

	return el;
}


function load_elemen() {
	var complete_book = $('#completeBookList');
	var incomplete_book = $('#incompleteBookList');

	complete_book.html("");
	incomplete_book.html("");


	//Buku complete
	for (var i = 0; i < data_complete.length; i++) {
		var row_data = data_complete[i];
		var buat_el = create_el( row_data );
		complete_book.append( buat_el );

	}

	//Buku incomplete
	for (var i = 0; i < data_incomplete.length; i++) {
		var row_data = data_incomplete[i];
		var buat_el = create_el( row_data );
		incomplete_book.append( buat_el );
	}

	// alert();

}

function event_DOM() {

	//Mendaftarkan ulang DOM pada elemen yang terkait yang dikhususkan eleen elemen yang baru dibuat setelah halaman pertama kali di load
	//INGAT!!  UNTUK ELEMEN ELEMEN BARU DIBUAT SETELAH PERTAMA KALI BROWSER DI LOAD

	$('.update_status').on('click', function() {
		var btn = $(this);
		var book_item = btn.parents('.book_item');
		var key = book_item.attr('data-key');
		var section_data = book_item.parents('.section_data');
		var status;
		if ( section_data.attr('id') == "completeBookList" ) {
			status = false;
			var kata = "Belum dibaca"
		}else{
			status = true;
			var kata = "Selesai dibaca"

		}

		var row_data = get_item(key);
		alert_modal( "Buku dengan judul " + row_data.title + " Diubah ke " + kata )

		update_status( key, status );
		refresh_page();
		// window.location.href ="index.html";
	});
	$('.btn_hapus').on('click', function() {
		var btn = $(this);
		var book_item = btn.parents('.book_item');
		var key = book_item.attr('data-key');

		var row_data = get_item(key);
		alert_modal( "Buku dengan judul " + row_data.title + " Dihapus" )

		localStorage.removeItem(key);
		refresh_page();
		// window.location.href ="index.html";

	});
}

function refresh_page( obj_opt = { opt_search : false, keyword : false } ) {

	// Jika opt_searchnya dalam parameter true, dengan format object seperti itu, maka lakukan algoritma search dari data yang sudah diambil
	/*
	obj_opt ={
		opt_search : true,
		keyword : "keyword dicari",
	}
	*/


	data_complete = get_all_data('complete');
	data_incomplete = get_all_data('not_complete');

	if ( obj_opt.opt_search == true ) {

		console.log('Algoritma search dijalankan!');
		// Lakukan algoritma search similar dengan kata_db nya adalah judul dari dari setiap data row
		var data_complete_search = [];
		var data_incomplete_search = [];

		let keyword = obj_opt.keyword; //query

		//Lakukan similiar search karakter untuk setiap row dengan nilai judul di data complete
		for (var i = 0; i < data_complete.length; i++) {
			let row_data = data_complete[i];
			let title = row_data.title;
			let similiar_judul = similiar_karakter( keyword, title )
			if ( similiar_judul == true ) {
				// Maka data yang akan di tampilkan atau yang mirip 
				data_complete_search.push( row_data );
			}
		}

		//Lakukan similiar search karakter untuk setiap row dengan nilai judul di data incomplete
		for (var i = 0; i < data_incomplete.length; i++) {
			let row_data = data_incomplete[i];
			let title = row_data.title;
			let similiar_judul = similiar_karakter( keyword, title )
			if ( similiar_judul == true ) {
				// Maka data yang akan di tampilkan atau yang mirip 
				data_incomplete_search.push( row_data );
			}
		}

		// Pindahkan ke data utama agar bisa nantinya di load oleh load_elemen()
		data_complete = data_complete_search;
		data_incomplete = data_incomplete_search;

	}


	load_elemen();
	//Mendaftarkan ulang DOM Event , karena elemennya baru dibuatdan ditambahkan jadi gak punya dom event
	event_DOM();
}

function similiar_karakter(query, kata_db) {

	/*
	Penjelasan simple similiar algoritma  

	Jika karakter query yang di ketikkan itu masih menjadi bagian dari karakter yang dibandingkan, maka itu bisa dianggap sama. Misalnya diketikkan query "dicoding" dan data yang di compare nilai karakternya "dicoding indo". Maka masih bisa dikatakan similiar karena "dicoding" terdapat di "dicoding indo"

	*/

	// var query = "dicoding";
	// var kata_db = "dicoding indo";

	var param_kata_similiar = false;
	if ( query.length < kata_db.length) {
		var param_kata = "";
		for (var i = 0; i < kata_db.length; i++) {
			param_kata = param_kata + kata_db[i];
			if ( query == param_kata  ) {
				param_kata_similiar = true;
				break;
			}
		}
	}else if ( query.length > kata_db.length  ) {
		//Kalo lebih panjang karakter query dibandingkan kata_db, sudah pasti pada algoritma ini salah. Karenda misal query "dicoding indo", dengan "dicodng". Karakter query bukan bagian dari dicoding dan tidak similiar
		param_kata_similiar = false;
	}else if ( query.length == kata_db.length ) {
		if ( query == kata_db ) {
			param_kata_similiar = true;
		}else{
			param_kata_similiar = false;
		}
	}


	var msg;
	if ( param_kata_similiar == true ) {
		msg_console = "keyword " + query + " bagian dari  " + kata_db + " dan similiar " +  param_kata_similiar;
	}else{
		msg_console = "keyword " + query + " bukan bagian dari  " + kata_db + " dan tidak similiar " +  param_kata_similiar;
	}


	console.log( msg_console );
	return param_kata_similiar;
}


$(document).ready(function(e) {


	refresh_page();
	// Form nambah data
	var bookForm = document.getElementById('bookForm');
	bookForm.addEventListener('submit', function(event) {
		event.preventDefault(); // Menghentikan pengiriman form default

		const bookForm = document.getElementById('bookForm');
		const bookFormTitleInput = document.getElementById('bookFormTitle');
		const bookFormAuthorInput = document.getElementById('bookFormAuthor');
		const bookFormYearInput = document.getElementById('bookFormYear');
		const bookFormIsCompleteCheckbox = document.getElementById('bookFormIsComplete');

		// Ambil nilai dari inputan form
		let title = bookFormTitleInput.value;
		let author = bookFormAuthorInput.value;
		let year = bookFormYearInput.value;
		let isComplete = bookFormIsCompleteCheckbox.checked;
		// alert_modal( isComplete );

		// Generate ID sementara untuk buku (bisa diganti dengan logika ID yang lebih kompleks)
		let id = Date.now().toString();

		// Panggil fungsi untuk menambahkan data ke Local Storage
		addBookToLocalStorage(id, title, author, year, isComplete);
		refresh_page();
		console.log( get_all_data( "all" ) );
	});

	$('input.search').on('keyup', function() {
		var input_search = $(this);
		var keyword_search = input_search.val();
		if ( keyword_search.length > 0 ) {
			// Terhitung karakter spasi 
			refresh_page({
				opt_search : true,
				keyword : keyword_search
			});
		}else{
			refresh_page();
		}

	});
	$('#searchBook').on('click', function(e) {
		var searchBook = $(this);
		var input_search = searchBook.find('input.search');
		var keyword_search = input_search.val();
		var input_search = form.find('.search');

		refresh_page({
			opt_search : true,
			keyword : keyword_search
		});

		return false;
	});

	$('.alert').on('click', function(e) {
		$(this).hide();
	});

	$('.load_screen .btn_start_app').on('click', function(e) {
		start_app()

	})
	$('.load_screen .btn_reset_app').on('click', function(e) {
		reset_app()
	})


	init_app()


});

function init_app() {
	setTimeout(function(e) {
		$('.load_screen .btn_start_app').fadeIn();
		$('.load_screen img').css('animation', 's');

		if ( get_all_data("all").length > 0 ) {
			$('.load_screen .btn_reset_app').fadeIn();
		}
	}, 1000);
}
function reset_app() {
	localStorage.clear();
	refresh_page();
	$('.btn_reset_app').remove();
	alert_modal("Awal yang baru, nikmati hari mu!");
}
function start_app() {
	$('.load_screen').hide();
}

function alert_modal( text_new ) {
	var alert_el = $('.alert');
	var text_el = alert_el.find('p');
	text_el.text(text_new);
	if ( !alert_el.is(':visible') ) {
		// Jika dia hilang
		alert_el.show();
	}
}











