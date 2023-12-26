const categoryDist = {
	"旅游": "dubai",
	"日常": "maldives",
	"重大事件": "sapa",
	"搞怪": "paris"
}
const preApi = "https://api.github.com/repos/yz-love-yxp/yz-love-yxp.github.io/contents/json/img";

function getImgs(page) {
	$.get(preApi + page + ".json", function(apiData, status){
		// 获取sha、data
		sha = apiData["sha"];
		pageData = JSON.parse(
			CryptoJS.enc.Utf8.stringify(
				CryptoJS.enc.Base64.parse(
					apiData["content"].replace(/\n/g, ""))));
		// 按img获取data
		var imgs = pageData["imgs"];
		var lastModel = $("#portfolioModalNew");
		for (let i = 0; i < imgs.length; i++) {
			// 获取解密后的主页块信息
			let [img, title, subtitle, address, description] = ["de-img", "title", "subtitle", "address", "description"].map((key)=>{
				return CryptoJS.AES.decrypt(imgs[i][key], sk, {"mode": CryptoJS.mode.ECB}).toString(CryptoJS.enc.Utf8);
			})
			dePageData.push({
				"img": img,
				"title": title,
				"subTitle": subtitle,
				"address": address,
				"description": description,
				"time": imgs[i]["time"],
				"category": imgs[i]["category"]
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
							<a href="#portfolioModalNew"><button type="button" class="btn btn-primary"  data-dismiss="modal">修改信息</button></a>
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

function setNowClick(index) {
	nowClick = index;
	$("#newTime").val(dePageData[index-1]["time"])
	$("#newAddress").val(dePageData[index-1]["address"])
	$("#newCategory").val(dePageData[index-1]["category"])
	$("#newTitle").val(dePageData[index-1]["title"])
	$("newSubtitle").val(dePageData[index-1]["subtitle"])
	$("newDescription").val(dePageData[index-1]["description"])
}

function encrypt(pt) {
	return CryptoJS.AES.encrypt(pt, sk, {"mode": CryptoJS.mode.ECB}).toString();
}

function newImg() {
	// let reader = new FileReader();
	// reader.readAsDataURL($("#newFile").prop("files")[0]);
	pageData["imgs"][nowClick-1] = {
		"time": $("#newTime").val(),
		// "address": encrypt($("#newAddress").val()),
		"address": encrypt($("#newAddress").val()),
		"title": encrypt($("#newTitle").val()),
		"subtitle": encrypt($("#newSubTitle").val()),
		"description": encrypt($("#newDescription").val()),
		"category": encrypt($("#newCategory").val()),
		"de-img": encrypt(nowImg)
	}
	$.ajax({
		"url": preApi + pagination.pages.pageNo + ".json",
		"method": "PUT",
		"dataType": "json",
		"data": JSON.stringify({
			"message": "测试更新文件接口",
			"content": CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(pageData))),
			"sha": sha
		}),
		success: function (result) {
			console.log("修改成功")
		},
		error: (err) => {
			console.log(err)
		},
		"headers": {
			'Authorization': 'Bearer ' + token,
			"content-type": "application/json"
		},
	})
	console.log(pageData)
}