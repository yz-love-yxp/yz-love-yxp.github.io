const categoryDist = {
	"旅游": "dubai",
	"日常": "maldives",
	"重大事件": "sapa",
	"搞怪": "paris"
}

function getImgs(page) {
	$.getJSON("json/img"+page+".json", function(data) {
	    var imgs = data["imgs"];
		var lastModel = $("#portfolioModalNew");
		for (let i = 0; i < imgs.length; i++) {
			// 获取解密后的主页块信息
			let [img, title, subtitle, address, description] = ["de-img", "title", "subtitle", "address", "description"].map((key)=>{
				return CryptoJS.AES.decrypt(imgs[i][key], CryptoJS.MD5(password).toString(), {"mode": CryptoJS.mode.ECB}).toString(CryptoJS.enc.Utf8);
			})
			// 设置主页块信息
			let index = i + 1;
			$("#img" + index).attr("src", img); // 设置图片
			$(".home-title" + index).text(title); // 设置标题
			$("#home-subtitle" + index).text(imgs[i]["time"] + " " + address); // 设置副标题
			$("#home-subtitle" + index).parent().parent().attr("href", "#portfolioModal" + (i + 1)); // 设置跳转
			$("#home-subtitle" + index).parent().parent().parent().parent().parent().addClass(categoryDist[imgs[i]["category"]]); // 设置分类
			// 设置块信息对应的model
			if ($("#portfolioModal" + index).length > 0) {
				$("#portfolioModal" + index).remove();
			} 
			let nowModel = $(
				`
				<div class="portfolio-modal modal fade" id="portfolioModal` 
				+ index +
				`" tabindex="-1" role="dialog" aria-hidden="true">
				  <div class="modal-content">
				    <div class="close-modal" data-dismiss="modal">
				      <div class="lr">
				        <div class="rl"> </div>
				      </div>
				    </div>
				    <div class="container">
				      <div class="row">
				        <div class="col-lg-8 col-lg-offset-2">
				          <div class="modal-body"> 
				            <!-- Project Details Go Here -->
				            <h2>`
							+ title +
							`</h2>
				            <p class="item-intro">`
							+ subtitle +
							`</p><img class="img-responsive img-centered" src="`
							+ img +
							`" alt="">  
							<p style="font-size: 16px">`
							+ description +
							`</p>
				            <ul class="list-inline">
				              <li style="font-size: 16px"><strong>日期</strong>: `
							  + imgs[i]["time"] +
							  `</li>
				              <li style="font-size: 16px"><strong>地点</strong>: `
							  + address +
							  `</li>
							  <li style="font-size: 16px"><strong>分类</strong>: `
							  + imgs[i]["category"] +
							  `</li>
				            </ul>
				            <button type="button" class="btn btn-primary" data-dismiss="modal"><i class="fa fa-times"></i> 关闭页面</button>
				          </div>
				        </div>
				      </div>
				    </div>
				  </div>
				</div>
				`
			);
			lastModel.before(nowModel);
			lastModel = nowModel;
		}
	});
}

function newImg(imgSeq) {
	
}

// function getFileContent(file) {
// 	const fileReader = new FileReader();
// 	fileReader.onloadend = (ev) => {
// 		const md5 = CryptoJS.MD5(CryptoJS.enc.Latin1.parse(ev.target.result)).toString(CryptoJS.enc.Hex);
// 		console.log(md5);
// 	}
// 	fileReader.readAsBinaryString(file);
// }
