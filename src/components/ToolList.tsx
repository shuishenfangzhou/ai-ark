import { useState, useEffect } from 'react';
import toolsData from '../../data/tools.json';

// URL生成器 - 知名AI工具映射（完整版，与index.astro保持一致）
const KNOWN_TOOL_URLS: Record<string, string> = {
  // AI聊天助手
  'ChatGPT': 'https://chat.openai.com',
  'Claude': 'https://claude.com',
  'Claude 3.5 Sonnet': 'https://claude.com',
  'Gemini': 'https://gemini.google.com',
  'DeepSeek': 'https://chat.deepseek.com',
  'Kimi': 'https://kimi.ai',
  'Kimi智能助手': 'https://kimi.ai',
  '豆包': 'https://www.doubao.com',
  '豆包大模型': 'https://www.doubao.com',
  '豆包大模型1.5': 'https://www.doubao.com',
  '讯飞星火': 'https://xinghuo.xfyun.cn',
  '腾讯元宝': 'https://yuanbao.tencent.com',
  '文心一言': 'https://yiyan.baidu.com',
  '通义千问': 'https://tongyi.aliyun.com',
  '千问': 'https://tongyi.aliyun.com',
  '智谱清言': 'https://chatglm.cn',
  '智谱清言 (ChatGLM)': 'https://chatglm.cn',
  '天工AI': 'https://tiangong.cn',
  '天工AI搜索': 'https://search.tiangong.cn',
  '百川智能': 'https://www.baichuan.com',
  '百川大模型': 'https://www.baichuan.com',
  '商量SenseChat': 'https://www.sensetime.com',
  '商量': 'https://www.sensetime.com',
  '问小白': 'https://wenxiaobai.com',
  '百小应': 'https://www.yi.com',
  '阶跃AI': 'https://stepchat.cn',
  'Copilot': 'https://copilot.microsoft.com',
  'Microsoft Copilot': 'https://copilot.microsoft.com',
  'Grok': 'https://grok.com',
  'Poe': 'https://poe.com',
  'Character.AI': 'https://character.ai',
  'Meta AI助手': 'https://www.meta.ai',
  'Z.ai': 'https://z.ai',
  'MiniMax': 'https://www.minimaxi.com',
  'LongCat': 'https://longcat.io',
  'Me.bot': 'https://me.bot',
  'Saylo': 'https://saylo.ai',
  '逗逗AI': 'https://www.doudouai.com',
  '百灵大模型': 'https://www.bole-ai.com',
  '书生大模型': 'https://internlm.org',

  // AI写作
  '蛙蛙写作': 'https://www.wawa.com',
   '笔灵AI写作': 'https://www.biling.cn',
  '稿定AI文案': 'https://www.gaoding.com',
  '稿定AI': 'https://www.gaoding.com',
  '稿易AI论文': 'https://www.gaoyiai.com',
  '光速写作': 'https://www.guangsuxiezuo.com',
  '秘塔写作猫': 'https://www.xiezuocat.com',
  'QuillBot': 'https://www.quillbot.com',
  'Notion AI': 'https://www.notion.so',
  'Notion': 'https://www.notion.so',
  'Copy.ai': 'https://www.copy.ai',
  'Jasper': 'https://www.jasper.ai',
  'Rytr': 'https://rytr.me',
  'FlowUs AI': 'https://flowus.cn',
  '讯飞绘文': 'https://turbodesk.com',
  '讯飞写作': 'https://xinghuo.xfyun.cn',
  '讯飞文书': 'https://writing.xfyun.cn',
  '彩云小梦': 'https://www.dream1920.com',
  '橙篇': 'https://cp.baidu.com',
  '深言达意': 'https://www.shenyandayi.com',
  '墨问': 'https://www.mowen.cn',
  '小鱼AI写作': 'https://www.xiaoyuai.com',
  '万能小in': 'https://www.xiaoin.cn',
  '墨刀AI': 'https://modao.cc',
  'Flowith': 'https://flowith.io',
  'GetDraft': 'https://www.getdraft.com',
  'YouMind': 'https://www.youmind.ai',
  'FeelFish': 'https://www.feelfish.com',
  'Loomi': 'https://www.meetloom.com',
  '落笔AI写作': 'https://www.luobii.com',
  '量子探险': 'https://www.lztx.org',
  '茅茅虫': 'https://www.maomaochong.net',
  '维普科创助手': 'https://www.cqvip.com',
  '沁言学术': 'https://www.qinyanai.com',
  '笔目鱼': 'https://www.bmysci.com',
  '66AI论文': 'https://www.66paper.cn',
  '千笔AI论文': 'https://www.qianbipaper.com',
  'Paperpal': 'https://www.paperpal.com',
  'ReadPo': 'https://www.readpo.com',
  '材料星AI': 'https://www.cailiaoxing.com',
  '社研通': 'https://www.sheyantong.com',
  'Rubriq': 'https://www.rubriq.com',
  '创一AI': 'https://www.chuangyi.com',
  'Muset': 'https://www.muset.ai',
  '华文笔杆': 'https://www.hwbigpen.com',
  '千页小说AI': 'https://www.qianyeai.cn',
  '松果AI写作': 'https://www.songguoai.com',
  '公文宝': 'https://www.gongwenbao.com',
  'PaperXie智能写作': 'https://www.paperxie.com',
  '迅捷AI写作': 'https://www.jzkt.net',
  'MidReal': 'https://midreal.ai',
  '墨狐AI': 'https://www.aixiao.com',
  '掌桥科研AI论文': 'https://www.zhangzhao.com',
  '灵犀速写': 'https://www.lingxicn.com',
  '库宝AI工作助手': 'https://www.kerege.com',
  '文状元': 'https://www.wenzhuangyuan.com',
  '晓语台': 'https://www.xiaoyutai.com',
  'DeepL Write': 'https://www.deepl.com/write',
  'Jenni': 'https://jenni.ai',
  '有道翻译·AI写作': 'https://fanyi.youdao.com',
  'Wordvice AI': 'https://wordvice.ai',
  'AI新媒体文章': 'https://www.aixincheng.cn',
  '魔撰写作': 'https://www.mozhuanxie.com',
  '宙语Cosmos': 'https://www.cosmos.ltd',
  '灵构AI笔记': 'https://www.linggoai.com',
  '有道写作': 'https://write.youdao.com',
  '写作蛙': 'https://www.xiezuowa.com',
  '文思助手': 'https://www.wensi.cn',
  'WriteWise': 'https://writewise.app',
  '百度作家平台': 'https://zuojia.baidu.com',
  '爱创作': 'https://www.aichuangzuo.com',
  'Verse': 'https://verse.app',
  'Moonbeam': 'https://www.getmoonbeam.com',
  'Cohesive': 'https://www.cohesive.so',
  '万彩AI': 'https://www.wancai.ai',
  'WritingPal': 'https://writingpal.com',
  'Magic Write': 'https://magicwrite.ai',
  'NovelAI': 'https://novelai.net',
  '奇妙文': 'https://www.qimiaowen.com',
  'Spell.tools': 'https://spell.tools',
  'HyperWrite': 'https://www.hyperwriteai.com',
  'Typeface AI': 'https://www.typeface.ai',
  '悉语': 'https://www.xiyu.cn',
  '文涌Effidit': 'https://effidit.qq.com',
  '火龙果写作': 'https://www.pitaya.com',
  '树熊写作': 'https://www.shuxiong.com',
  '爱改写': 'https://www.aigaixie.com',
  'HeyFriday': 'https://www.heyfriday.ai',
  '易撰': 'https://www.yizhuan.com',
  '智搜': 'https://www.zhisou.com',
  '创作王': 'https://www.chuangzuowang.com',
  '字符狂飙': 'https://www.zifukuangbiao.com',
  'XPaper AI': 'https://www.xpaper.ai',
  '悟智写作': 'https://www.wuzhi.ai',
  '讯飞智检': 'https://www.iflyrec.com/zhijian',
  'ContentBot': 'https://contentbot.ai',
  'Bearly': 'https://bearly.ai',
  '快文CopyDone': 'https://www.copydone.com',
  'Peppertype.ai': 'https://peppertype.ai',
  'GetGenius': 'https://www.getgenius.ai',
  '笔尖AI写作': 'https://www.bijianai.com',

  // AI绘画
  'Midjourney': 'https://www.midjourney.com',
  'Stable Diffusion': 'https://stability.ai',
  'DALL-E': 'https://openai.com/dall-e-3',
  'DALL·E 3': 'https://openai.com/dall-e-3',
  'Leonardo AI': 'https://www.leonardo.ai',
  'LiblibAI': 'https://www.liblibai.com',
  'LiblibAI·哩布哩布AI': 'https://www.liblibai.com',
  'LiblibAI高清放大': 'https://www.liblibai.com',
  'LiblibAI去水印': 'https://www.liblibai.com',
  'LiblibAI高清修复': 'https://www.liblibai.com',
  '堆友AI': 'https://www.doudizy.com',
  '堆友AI高清': 'https://www.doudizy.com',
  '堆友AI消除': 'https://www.doudizy.com',
  '堆友AI反应堆': 'https://www.doudizy.com',
  '堆友AI商品图': 'https://www.doudizy.com',
  '堆友AI视频': 'https://www.doudizy.com',
  '绘蛙': 'https://www.huiwa.com',
  '绘蛙AI高清': 'https://www.huiwa.com',
  '绘蛙AI视频': 'https://www.huiwa.com',
  '绘蛙AI消除': 'https://www.huiwa.com',
  '绘蛙AI转3D': 'https://www.huiwa.com',
  '绘蛙AI抠图': 'https://www.huiwa.com',
  '美图无损放大': 'https://www.meitu.com',
  '美图AI消除': 'https://www.meitu.com',
  '美图商拍': 'https://www.meitu.com',
  '美图抠图': 'https://www.meitu.com',
  '美图AI PPT': 'https://www.meitu.com',
  '美图云修': 'https://cloud.mt.com',
  '星流AI': 'https://www.star-rail.com',
  'Pic Copilot': 'https://piccopilot.com',
  'Pic Copilot AI抠图': 'https://piccopilot.com',
  'Fotor AI Image Upscaler': 'https://www.fotor.com',
  'Magnific AI': 'https://www.magnific.ai',
  'BigJPG': 'https://bigjpg.com',
  'Upscayl': 'https://upscayl.org',
  "Let's Enhance": "https://letsenhance.io",
  'ClipDrop Image Upscaler': 'https://clipdrop.co',
  'ClipDrop Remove Background': 'https://clipdrop.co',
  '阿贝智能': 'https://www.abeiai.cn',
  '阿贝': 'https://www.abeiai.cn',
  '即梦': 'https://jimeng.com',
  '即梦AI': 'https://jimeng.com',

  // AI视频
  'Runway': 'https://www.runwayml.com',
  'Pika Labs': 'https://pika.art',
  'Pika': 'https://pika.art',
  'Sora': 'https://openai.com/sora',
  '可灵AI': 'https://klingai.com',
  '可灵': 'https://klingai.com',
  '即创': 'https://www.bytedance.com',
  'Vidu': 'https://www.vidu.sh',
  'HeyGen': 'https://www.heygen.com',
  '有言': 'https://www.youyan.com',
  '白日梦': 'https://www.dreamedia.com',
  '蝉镜': 'https://www.chanjet.com',
  '腾讯混元AI视频': 'https://hunyuan.tencent.com',
  'Pollo AI': 'https://www.pollo.ai',
  'Higgsfield': 'https://www.higgsfield.ai',
  'MochiAni': 'https://www.mochi.co',
  'JoyPix': 'https://www.joypix.com',
  'Keevx': 'https://www.keevx.com',
  'Keevx声音克隆': 'https://www.keevx.com',
  'TapNow': 'https://www.tapnow.ai',
  '造次': 'https://www.zaoci.com',
  'Tavus': 'https://www.tavus.io',
  'Vizard': 'https://www.vizard.ai',
  '秒创': 'https://www.miaochuang.cn',
  'SkyReels': 'https://www.skyreels.com',
  'Dream Machine': 'https://dreammachine.ai',
  'Hedra': 'https://www.hedra.ai',
  'Vozo': 'https://www.vozo.ai',
  'Viggle': 'https://www.viggle.ai',
  'Opus Clip': 'https://www.opusclip.com',
  'Filmora': 'https://filmora.wondershare.com',
  'Descript': 'https://www.descript.com',
  '讯飞绘镜': 'https://www.iflyrec.com',
  '曦灵数字人': 'https://www.xiling.com',
  '开拍': 'https://www.kaipai.com',
  'Duix': 'https://www.duix.ai',
  'D-ID': 'https://www.d-id.com',
  '万兴播爆': 'https://www.wondershare.com',
  'Vimi': 'https://www.vimi.ai',
  '艺映AI': 'https://www.yiyingai.com',
  'Flyme AI': 'https://www.flymeai.com',
  '秒画': 'https://www.miaohua.com',
  '秒绘AI': 'https://www.miaohui.cn',
  'WHEE': 'https://www.whee.com',
  '呜哩': 'https://www.wulii.cn',
  '奇域AI': 'https://www.qiyuai.com',
  '触手AI绘画': 'https://www.chushouai.com',
  '造梦日记': 'https://www.zaomengriji.com',
  '超能画布': 'https://www.chaonenghuabu.com',
  'Bing Image Creator': 'https://www.bing.com/images/create',
  'Adobe Firefly': 'https://www.adobe.com/firefly',
  '简单AI': 'https://www.jiandanai.cn',
  '摩笔马良': 'https://www.mobimailiang.com',
  'Exactly.ai': 'https://www.exactly.ai',
  '画宇宙': 'https://www.huayu.cn',
  '6pen Art': 'https://6pen.art',
  'Visual Electric': 'https://www.visualelectric.com',
  '360智绘': 'https://image.so.com/ai',
  '网易AI创意工坊': 'https://ai.163.com',
  'Imagine with Meta': 'https://imagine.meta.com',
  'Freepik AI Image Generator': 'https://www.freepik.com/ai-image-generator',
  'Stockimg AI': 'https://stockimg.ai',
  'Stable Doodle': 'https://stabledoodle.com',
  'Canva AI图像生成': 'https://www.canva.com',

  // AI编程
  'GitHub Copilot': 'https://github.com/features/copilot',
  'Cursor': 'https://cursor.sh',
  'Claude Code': 'https://claude.com/code',
  'CodeWhisperer': 'https://aws.amazon.com/codewhisperer',
  'Tabnine': 'https://www.tabnine.com',
  'Replit': 'https://replit.com',
  'v0': 'https://v0.dev',
  'Bolt.new': 'https://bolt.new',
  'Devin': 'https://cognition.ai',
  'Trae': 'https://www.trae.ai',
  'TRAE编程': 'https://www.trae.ai',
  '秒哒': 'https://www.miada.cn',
  '文心快码': 'https://code.baidu.com',
  '通义灵码': 'https://tongyi.aliyun.com/lingma',
  'CodeGeeX': 'https://www.codegeex.cn',
  'Cody': 'https://sourcegraph.com/cody',
  'Kiro': 'https://www.kiro.ai',
  'Lovable': 'https://www.lovable.dev',
  'OpenCode': 'https://vscode.dev',
  'Google Antigravity': 'https://antigravity.google',
  'Ollama': 'https://ollama.com',
  'LM Studio': 'https://lmstudio.ai',
  'Groq': 'https://groq.com',
  '代码小浣熊': 'https://www.hnxiao.com',
  'DevChat': 'https://www.devchat.ai',
  'JoyCode': 'https://www.joycode.cn',
  'iFlyCode': 'https://www.iflycode.com',
  'CodeFuse': 'https://www.codefuse.cn',
  'Codeium': 'https://www.codeium.com',
  'JetBrains AI': 'https://www.jetbrains.com/ai',

  // AI搜索
  'Perplexity AI': 'https://www.perplexity.ai',
  'Perplexity': 'https://www.perplexity.ai',
  '夸克AI': 'https://www.quark.cn',
  '秘塔AI搜索': 'https://www.metaso.cn',
  '纳米AI': 'https://www.nami.com',
  'Felo': 'https://felo.ai',
  '玻尔': 'https://www.bohr.io',
  'SearchGPT': 'https://searchgpt.com',
  'AMiner': 'https://www.aminer.cn',
  '心流': 'https://www.iflow.cn',
  'Devv': 'https://www.devv.ai',
  '知乎直答': 'https://www.zhihu.com/za',
  '360AI搜索': 'https://www.so.com',
  'Phind': 'https://www.phind.com',
  'iAsk AI': 'https://www.iask.ai',
  'Glean': 'https://www.glean.com',
  'AlphaSense': 'https://www.alpha-sense.com',
  'Consensus': 'https://consensus.app',
  'Exa AI': 'https://exa.ai',
  'CuspAI': 'https://www.cusp.ai',
  'WisPaper': 'https://www.wispaper.com',

  // AI办公
  'Canva': 'https://www.canva.com',
  'Canva Magic Design': 'https://www.canva.com',
  'Magic Design': 'https://www.canva.com',
  'Gamma': 'https://gamma.app',
  'AiPPT': 'https://www.aippt.cn',
  '飞书妙记': 'https://www.feishu.cn',
  '飞书多维表格': 'https://www.feishu.cn',
  '通义听悟': 'https://tingwu.aliyun.com',
  '讯飞会议': 'https://meeting.xfyun.cn',
  'Otter.ai': 'https://www.otter.ai',
  'Zoom Workplace': 'https://zoom.us',
  'Fireflies.ai': 'https://www.fireflies.ai',
  'Noty.ai': 'https://www.noty.ai',
  'Airgram': 'https://www.airgram.io',
  'Loom': 'https://www.loom.com',
  'WPS灵犀': 'https://www.wps.cn',
  'WPS AI': 'https://www.wps.cn',
  'Monica': 'https://www.monica.im',
  'Glif': 'https://www.glif.app',
  'TinyWow': 'https://tinywow.com',
  'Figma': 'https://www.figma.com',
  'Figma AI': 'https://www.figma.com',
  'Pixso AI': 'https://www.pixso.ai',
  'Microsoft Designer': 'https://designer.microsoft.com',
  '创客贴AI': 'https://www.chuangkit.com',
  '创客贴AI画匠': 'https://www.chuangkit.com',
  '爱设计': 'https://www.isheji.com',
  '美间AI': 'https://www.meijian.com',
  '美间AI商拍': 'https://www.meijian.com',
  '135 AI排版': 'https://www.135editor.com',
  '鹿班': 'https://luban.aliyun.com',
  '标小智LOGO生成器': 'https://www.logosc.cn',
  'Looka': 'https://www.looka.com',
  'Recraft AI': 'https://www.recraft.ai',
  'Holopix AI': 'https://www.holopix.ai',
  '咔片PPT': 'https://www.kapianppt.com',
  'iSlide AIPPT': 'https://www.islide.cc',
  '博思AIPPT': 'https://www.bosippt.com',
  'Pi智能PPT': 'https://www.pi-ai.cn',
  '稿定PPT': 'https://www.gaoding.com',
  '笔格AIPPT': 'https://www.bige.cc',
  '笔灵AIPPT': 'https://www.biling.cn',
  '百度文库AI助手': 'https://wenku.baidu.com',
  '讯飞智文': 'https://www.iflyrec.com',
  'Napkin': 'https://www.napkin.ai',
  'ChartGen': 'https://www.chartgen.cn',
  'Diagrimo': 'https://www.diagrimo.cn',
  'PicDoc': 'https://www.picdoc.cn',
  '飞象老师': 'https://www.feixiang.cn',
  'Kimi PPT助手': 'https://kimi.ai',
  '夸克PPT': 'https://www.quark.cn',
  '课灵PPT': 'https://www.kelign.com',
  '课灵 PPT': 'https://www.kelign.com',
  '万兴智演': 'https://www.wondershare.com',
  '麦当秀MindShow': 'https://www.mindshow.cn',
  '腾讯问卷': 'https://wj.qq.com',
  'ChatExcel': 'https://www.chatexcel.com',
  '察言观数AskTable': 'https://www.asktable.cn',
  'Tomoro': 'https://www.tomoro.cn',
  'Shortcut': 'https://www.shortcut.cn',
  '爱图表': 'https://www.aitubiao.cn',
  'ChartinAI': 'https://www.chartin.cn',
  'vika维格云': 'https://www.vika.cn',
  '百度GBI': 'https://www.baidu.com',
  'Ajelix': 'https://www.ajelix.com',
  'Sheet+': 'https://www.sheetplus.cn',
  '轻云图': 'https://www.qingyuntu.cn',
  '北极九章': 'https://www.beiji.cn',
  'Formula bot': 'https://www.formulabot.com',

  // AI音频
  'Suno': 'https://suno.ai',
  'Suno AI': 'https://suno.ai',
  'Udio': 'https://www.udio.com',
  'Stable Audio': 'https://stableaudio.com',
  'ElevenLabs': 'https://www.elevenlabs.io',
  'LOVO AI': 'https://www.lovo.ai',
  'Murf AI': 'https://www.murf.ai',
  'Uberduck': 'https://uberduck.ai',
  '魔音工坊': 'https://www.moyin.com',
  '讯飞智作': 'https://www.iflyrec.com/zhuanzuo',
  '讯飞听见': 'https://www.iflyrec.com',
  '网易天音': 'https://tianyin.163.com',
  '海绵音乐': 'https://music.163.com',
  'TTSMaker': 'https://www.ttsmaker.com',
  'TextToSpeech': 'https://www.texttospeech.im',
  'TurboScribe': 'https://www.turboscribe.ai',
  'MemoAI': 'https://memoai.app',
  'Reecho睿声': 'https://www.reecho.cn',
  'Vemus未音': 'https://www.vemus.com',
  '音疯': 'https://www.yinfeng.cn',
  '音潮': 'https://www.yinchao.cn',
  '音剪': 'https://www.yinjian.com',
  '音秘': 'https://www.yinmi.com',
  'Lyrics Into Song AI': 'https://lyricsintosong.com',
  'NotebookLM': 'https://notebooklm.google',
  '琅琅配音': 'https://www.langlangpeiyin.com',
  'Tunee': 'https://www.tunee.com',

  // AI模型
  'Hugging Face': 'https://huggingface.co',
  'Mistral AI': 'https://mistral.ai',
  'GPT-4': 'https://chat.openai.com',
  'GPT-4o': 'https://chat.openai.com',
  'OpenAI o1': 'https://chat.openai.com',
  'LLaMA': 'https://llama.meta.com',
  'Llama 3': 'https://llama.meta.com',
  'Gemma': 'https://ai.google.dev/gemma',
  'Cohere': 'https://cohere.com',
  '魔搭社区': 'https://modelscope.cn',
  'FastGPT': 'https://fastgpt.cn',
  'Dify': 'https://www.dify.ai',
  'AnythingLLM': 'https://www.anythingllm.com',
  'Jan': 'https://www.jan.ai',
  'AutoGPT': 'https://agentgpt.reworkd.ai',
  'AgentGPT': 'https://agentgpt.reworkd.ai',
  'Gradio': 'https://www.gradio.app',
  'Cherry Studio': 'https://www.cherry-ai.com',
  'Nano Banana': 'https://nanobanana.com',

  // AI代理/智能体
  'Coze': 'https://www.coze.cn',
  '扣子': 'www.coze.cn',
  'Manus': 'https://www.manus.im',
  'FlowMuse AI': 'https://www.flowmuse.com',
  'Genspark': 'https://www.genspark.ai',
  'Zapier': 'https://www.zapier.com',
  'Zapier AI': 'https://www.zapier.com',
  'Make (Integromat)': 'https://www.make.com',
  'n8n': 'https://n8n.io',
  'OpenRouter': 'https://openrouter.ai',
  'SiliconFlow': 'https://www.siliconflow.cn',
  'Wordware': 'https://www.wordware.ai',
  '码上飞': 'https://www.mashangfei.cn',
  '讯飞星辰Agent': 'https://www.iflyrec.com',
  '01Agent': 'https://www.01agent.com',
  '金灵AI': 'https://www.jinling.cn',

  // 翻译工具
  '沉浸式翻译': 'https://immersivetranslate.com',
  'DeepL翻译': 'https://www.deepl.com',
  'Google翻译': 'https://translate.google.com',
  '百度翻译': 'https://fanyi.baidu.com',
  '阿里翻译': 'https://www.alibaba.com',
  '搜狗翻译': 'https://fanyi.sogou.com',
  '腾讯翻译君': 'https://fanyi.qq.com',
  '讯飞智能翻译': 'https://www.iflyrec.com',
  '有道翻译': 'https://fanyi.youdao.com',
  '必应翻译': 'https://www.bing.com',

  // 办公协作
  '钉钉·个人版': 'https://www.dingtalk.com',
  '钉钉斜杠"/"': 'https://www.dingtalk.com',
  '钉钉斜杠"／"': 'https://www.dingtalk.com',
  '飞书智能伙伴': 'https://www.feishu.cn',

  // 设计工具
  'AI设计神器': 'https://www.aidesign.cn',
  'Logoai': 'https://www.logoai.com',
  '豆绘AI': 'https://www.douhui.ai',
  '千图网': 'https://www.58pic.com',
  'Pictographic': 'https://pictographic.io',
  'Fable Prism': 'https://www.fableprism.com',
  'Wegic': 'https://www.wegic.co',
  '匠紫': 'https://www.jiangzi.com',
  'Collov AI': 'https://www.collov.com',
  '包图网AI素材库': 'https://www.ibaotu.com',
  '易可图': 'https://www.yiketu.com',
  '笔魂AI': 'https://www.bihun.com',
  'Creatie': 'https://www.creatie.io',
  'Kittl': 'https://www.kittl.com',
  'Dzine': 'https://www.dzine.app',
  'Ilus AI': 'https://www.ilus.ai',
  '酷家乐AI': 'https://www.kujiale.com',
  'Framer AI': 'https://www.framer.com',
  'LogoliveryAI': 'https://www.logolivery.ai',
  'Motiff 妙多': 'https://www.motiff.com',
  'Pimento': 'https://www.pimento.ai',
  'Logo Diffusion': 'https://www.logodiffusion.com',
  'Realibox AI': 'https://www.realibox.com',
  'Vectorizer.AI': 'https://www.vectorizer.ai',
  '模袋云AI': 'https://www.modai.club',
  'Vizcom': 'https://www.vizcom.co',
  'Dora AI': 'https://www.dora.run',
  'Designs.ai': 'https://www.designs.ai',
  'Galileo AI': 'https://www.galileo.ai',
  'Spline AI': 'https://spline.design',
  'Uizard': 'https://www.uizard.com',
  'Luma AI': 'https://www.luma.ai',
  '图宇宙': 'https://www.tuyuzhou.com',
  '阿里云智能logo设计': 'https://www.aliyun.com',
  'AIDesign': 'https://www.aidesign.cn',
  'Fabrie': 'https://www.fabrie.com',
  'Fabrie AI': 'https://www.fabrie.com',
  'Poly': 'https://www.withpoly.com',
  'Illustroke': 'https://www.illustroke.com',
  'Eva Design System': 'https://eva.design',
  'Color Wheel': 'https://colorwheel.co',
  'Huemint': 'https://www.huemint.com',
  'ColorMagic': 'https://www.colormagic.ai',
  'Logomaster.ai': 'https://www.logomaster.ai',
  'Magician': 'https://www.magician.design',
  'Appicons AI': 'https://www.appicons.ai',
  'IconifyAI': 'https://www.iconifyai.com',
  'Khroma': 'https://www.khroma.co',
  '即时AI': 'https://www.jishiai.com',
  'Alpaca': 'https://www.alpaca.ai',
  '智绘设计': 'https://www.zhihuicn.com',
  '简单设计': 'https://www.jiandan.com',
  '笔格设计': 'https://www.bige.com',

  // 抠图工具
  'Pixian.AI': 'https://www.pixian.ai',
  'Icons8 Background Remover': 'https://icons8.com',
  'BgSub': 'https://www.bgsub.com',
  'Erase.bg': 'https://www.erase.bg',
  '酷宣AI': 'https://www.kuxuanai.com',
  '遨虾': 'https://www.aoxia.cn',
  '亿话': 'https://www.yihua.ai',
  'Tago': 'https://www.tago.cn',
  'NeoDomain': 'https://www.neodomain.com',
  'Opera Neon': 'https://www.opera.com',
  'Seko': 'https://www.seko.cn',
  'TabTab': 'https://www.tabtab.cn',
  '月亮树AI选品': 'https://www.yueliangshu.cn',
  '如此AI员工': 'https://www.ruliai.com',
  'Teamo': 'https://www.teamo.cn',
  'SciMaster': 'https://www.scimaster.com',
  'Zeabur': 'https://zeabur.com',
  'MyShell': 'https://www.myshell.ai',
  'FinGenius': 'https://www.fingenius.com',
  '混沌Deep Innovation': 'https://www.deepinnovation.cn',
  '椒图AI': 'https://www.jiaptu.cn',

  // 图片工具
  'GoProd': 'https://www.goprod.io',
  'Mejorar Imagen': 'https://mejorarimagen.com',
  'Icons8 Smart Upscaler': 'https://icons8.com/swift',
  'Img.Upscaler': 'https://imgupscaler.com',
  'Zyro AI Image Upscaler': 'https://zyro.com/tools/image-upscaler',
  'Media.io AI Image Upscaler': 'https://www.media.io',
  'Upscale.media': 'https://www.upscale.media',
  'Nero Image Upscaler': 'https://www.nero.com/ai-upscaler',
  'VanceAI Image Resizer': 'https://vanceai.com',
  'PhotoAid Image Upscaler': 'https://www.photoaid.com',
  'Upscalepics': 'https://www.upscalepics.com',
  'Image Enlarger': 'https://www.imageenlarger.com',
  'Pixelhunter': 'https://pixelhunter.io',
  'Hama': 'https://www.hama.app',
  'IOPaint': 'https://www.iopaint.com',
  'Bg Eraser': 'https://www.bgeraser.com',
  'SnapEdit': 'https://snapedit.app',
  'Cleanup.pictures': 'https://cleanup.pictures',
  'HitPaw Watermark Remover': 'https://www.hitpaw.com',
  'HitPaw': 'https://www.hitpaw.com',
  'Magic Eraser': 'https://www.magiceraser.io',
  'WatermarkRemover': 'https://www.watermarkremover.io',
  'Facet': 'https://facet.ai',
  'Relight': 'https://relight.ai',
  'imgAK': 'https://www.imgak.com',
  'Remini': 'https://www.remini.ai',
  'jpgHD': 'https://jpghd.com',
  '像素蛋糕PixCake': 'https://www.pixcake.com',
  '咻图AI': 'https://www.xiaoimage.com',
  'AirBrush': 'https://www.airbrush.com',
  'restorePhotos.io': 'https://www.restorephotos.io',
  'PicMa Studio': 'https://picma.app',
  'Palette': 'https://www.palette.fm',
  'Playground AI': 'https://playgroundai.com',
  '吐司AI高清': 'https://www.tusiart.com',
  '吐司AI消除': 'https://www.tusiart.com',
  '吐司AI抠图': 'https://www.tusiart.com',
  'transpic': 'https://www.transpic.cn',
  'Cutout.Pro': 'https://www.cutout.pro',
  'Cutout.Pro Retouch': 'https://www.cutout.pro',
  'Cutout.Pro老照片上色': 'https://www.cutout.pro',
  'Cutout.Pro抠图': 'https://www.cutout.pro',
  '蜜蜂剪辑': 'https://www.beemvideo.com',
  '造点AI': 'https://www.zaodianai.com',
  'RunningHub': 'https://www.runninghub.com',
  'insMind': 'https://www.insmind.com',
  'AI改图神器': 'https://www.gaitu.cn',
  '视觉工厂': 'https://www.shijue.cn',
  '妙话AI': 'https://www.miaohuaai.com',
  'Krea AI': 'https://www.krea.ai',
  'Kira': 'https://www.kira.ai',
  'Photoroom': 'https://www.photoroom.com',
  'Ribbet.ai': 'https://www.ribbet.ai',
  '万相营造': 'https://www.wanxiang.cn',
  '悟空图像PhotoSir': 'https://www.wukong.com',
  '360智图': 'https://zhitu.360.com',
  '光子AI': 'https://www.lightson.cn',
  '光子AI抠图': 'https://www.lightson.cn',
  '蜂鸟AI': 'https://www.fengniao.ai',
  'PhotoStudio AI': 'https://www.photostudio.ai',
  '蕉点AI': 'https://www.jiaodianai.com',
  '潮际好麦': 'https://www.chaojihao.com',
  '千鹿AI': 'https://www.qianlu.ai',
  '妙思': 'https://www.miaosi.cn',
  'Cliclic AI': 'https://www.cliclic.com',
  '羚珑': 'https://www.linglong.cn',
  '创自由': 'https://www.chuangziyou.com',
  '灵动AI': 'https://www.lingdongai.com',
  'Pebblely': 'https://www.pebblely.com',
  'Mokker AI': 'https://www.mokker.ai',
  '花生图像': 'https://www.huasheng.cn',
  '图生生': 'https://www.tusheng.cn',
  'WeShop唯象': 'https://www.weshop.com',
  'Tripo AI': 'https://www.tripobrands.com',
  '腾讯混元3D': 'https://hunyuan.tencent.com',
  'Neural4D': 'https://www.neural4d.com',
  'Marble': 'https://www.marble.com',
  'Fast3D': 'https://www.fast3d.cn',
  '造好物': 'https://www.zaohao.com',
  'Hitems': 'https://www.hitems.cn',
  'Style3D': 'https://www.style3d.com',
  'LuxReal': 'https://www.luxreal.com',
  'VoxCraft': 'https://www.voxcraft.ai',
  'Meshy': 'https://www.meshy.ai',
  'LiblibAI抠图': 'https://www.liblibai.com',
  '顽兔抠图': 'https://www.wantu.cn',
  '鲜艺AI抠图': 'https://www.xianyicc.com',
  '抠抠图': 'https://www.koukutu.com',
  '千图设计室AI助手': 'https://www.58pic.com',
  'Adobe Image Background Remover': 'https://www.adobe.com',
  'Removal.AI': 'https://www.removal.ai',
  'Background Eraser': 'https://www.backgrounderaser.com',
  'Slazzer': 'https://www.slazzer.com',
  '吐司AI': 'https://www.tusiart.com',
  'BGremover': 'https://www.bgremover.io',
  'Quicktools Background Remover': 'https://quicktools.io',
  'PhotoScissors': 'https://photoscissors.com',
  'ClippingMagic': 'https://clippingmagic.com',
  '图可丽': 'https://www.tukeli.cn',
  'Hotpot AI Background Remover': 'https://hotpot.ai',
  'Stylized': 'https://www.stylized.ai',
  'Booth.ai': 'https://www.booth.ai',
  '稿定AI社区': 'https://www.gaoding.com',
  '稿定AI商品图': 'https://www.gaoding.com',
  '稿定AI变清晰': 'https://www.gaoding.com',
  'LiblibAI电商营销': 'https://www.liblibai.com',

  // 学习资源
  'AI大学堂': 'https://www.aidaxue.com',
  '堆友AI学习': 'https://www.doudizy.com',
  'AI分享圈': 'https://www.aifxq.com',
  'Day of AI': 'https://www.dayofai.com',
  'fast.ai': 'https://www.fast.ai',
  '学吧导航': 'https://www.xueba.cn',
  'Coursera': 'https://www.coursera.org',
  'Elements of AI': 'https://www.elementsofai.com',
  'DeepLearning.AI': 'https://www.deeplearning.ai',
  '动手学深度学习': 'https://zh.d2l.ai',
  'MachineLearningMastery': 'https://machinelearningmastery.com',
  'Generative AI for Beginners': 'https://microsoft.github.io',
  'ML for Beginners': 'https://github.com',
  'Kaggle': 'https://www.kaggle.com',
  '神经网络入门': 'https://www.intro2ml.com',
  'Trancy': 'https://www.trancy.org',
  'Reading Coach': 'https://www.readingcoach.com',
  '飞桨AI Studio': 'https://aistudio.baidu.com',
  '腾讯扣叮': 'https://coding.qq.com',
  '阿里云AI学习路线': 'https://www.aliyun.com',
  'Udacity AI学院': 'https://www.udacity.com',
  'Google AI': 'https://ai.google',
  'ShowMeAI知识社区': 'https://www.showmeai.com',

  // 开发平台
  '飞桨PaddlePaddle': 'https://www.paddlepaddle.org.cn',
  '昇思MindSpore': 'https://www.mindspore.cn',
  'PyTorch': 'https://pytorch.org',
  'TensorFlow': 'https://www.tensorflow.org',
  'Scikit-learn': 'https://scikit-learn.org',
  'Vercel AI SDK': 'https://sdk.vercel.ai',
  'Keras': 'https://keras.io',
  'NumPy': 'https://numpy.org',
  'JAX': 'https://jax.readthedocs.io',
  'Lightning AI': 'https://lightning.ai',
  'Leap': 'https://www.tryleap.ai',
  'ChatDev': 'https://chatdev.chaindesk.cn',

  // AI检测
  'GPTZero': 'https://www.gptzero.me',
  '朱雀AI检测': 'https://www.jiqie.com',
  'Originality.AI': 'https://www.originality.ai',
  'CopyLeaks': 'https://www.copyleaks.com',
  'Winston AI': 'https://www.winstonai.io',
  'AISEO AI Content Detector': 'https://www.aiseo.com',
  'SpeedAI': 'https://www.speediai.com',
  'Aibiye降AI率': 'https://www.aibiye.com',
  '言笔降AI率': 'https://www.yanbiji.com',
  '学术猹': 'https://www.xueshu.ai',
  '团象': 'https://tuanyiang.com',
  '挖错网': 'https://www.wacuo.net',
  '66降AI率': 'https://www.66paper.cn',
  '笔灵降AI率': 'https://www.biling.cn',
};

  // 获取工具URL的函数
function getToolUrl(tool: any): string {
  if (tool.url && tool.url.trim() !== '' && tool.url.startsWith('http')) {
    return tool.url;
  }
  if (KNOWN_TOOL_URLS[tool.name]) {
    return KNOWN_TOOL_URLS[tool.name];
  }
  return `https://www.ai-bot.cn/?s=${encodeURIComponent(tool.name)}`;
}

// 工具类型定义
interface Tool {
  id: string;
  name: string;
  name_en?: string;
  description: string;
  description_full?: string;
  url: string;
  logo?: string | null;
  category: string;
  tags: string[];
  pricing: string;
  rating: number;
  popularity?: number;
  features?: string[];
  languages?: string[];
  [key: string]: any;
}

// 扩展Window类型
declare global {
  interface Window {
    openToolDetail?: (tool: Tool) => void;
  }
}

export default function ToolList() {
  const [tools, setTools] = useState<Tool[]>(toolsData.tools as Tool[]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>(toolsData.tools as Tool[]);
  const [searchResults, setSearchResults] = useState<Tool[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // 监听顶部搜索框的搜索事件
  useEffect(() => {
    const handleToolSearch = (e: CustomEvent) => {
      if (e.detail === null) {
        // 重置显示所有工具
        setSearchResults(null);
        setFilteredTools(tools);
        setCurrentPage(1);
      } else {
        // 显示搜索结果
        setSearchResults(e.detail);
        setFilteredTools(e.detail);
        setCurrentPage(1);
      }
    };
    
    // 监听分类筛选事件
    const handleCategoryFilter = (e: CustomEvent) => {
      const category = e.detail;
      if (category === null) {
        // 显示全部
        setFilteredTools(tools);
        setSearchResults(null);
      } else {
        // 按分类筛选
        const filtered = tools.filter(tool => tool.category === category);
        setFilteredTools(filtered);
        setSearchResults(null);
      }
      setCurrentPage(1);
    };
    
    window.addEventListener('toolSearch', handleToolSearch as EventListener);
    window.addEventListener('categoryFilter', handleCategoryFilter as EventListener);
    
    // 清理监听
    return () => {
      window.removeEventListener('toolSearch', handleToolSearch as EventListener);
      window.removeEventListener('categoryFilter', handleCategoryFilter as EventListener);
    };
  }, [tools]);

  // 分页计算
  const displayTools = searchResults !== null ? searchResults : filteredTools;
  const totalPages = Math.ceil(displayTools.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTools = displayTools.slice(startIndex, startIndex + itemsPerPage);


  // 获取Emoji图标
  const getEmojiIcon = (category: string) => {
    const emojiMap: Record<string, string> = {
      'AI对话': '💬',
      'AI绘画': '🎨',
      'AI写作': '✍️',
      'AI编程': '💻',
      'AI视频': '🎬',
      'AI办公': '📊',
      'AI音频': '🎵',
      'AI设计': '🎯',
      'AI搜索': '🔍',
      'AI模型': '🧠',
    };
    return emojiMap[category] || '🤖';
  };

  // 获取渐变色
  const getGradientClass = (category: string) => {
    const gradientMap: Record<string, string> = {
      'AI对话': 'from-blue-500 to-indigo-600',
      'AI绘画': 'from-purple-500 to-pink-500',
      'AI写作': 'from-amber-500 to-orange-500',
      'AI编程': 'from-emerald-500 to-teal-500',
      'AI视频': 'from-pink-500 to-rose-600',
      'AI办公': 'from-cyan-500 to-blue-500',
      'AI音频': 'from-rose-500 to-red-500',
      'AI设计': 'from-violet-500 to-purple-500',
      'AI搜索': 'from-teal-500 to-cyan-500',
      'AI模型': 'from-indigo-500 to-blue-600',
    };
    return gradientMap[category] || 'from-blue-500 to-indigo-600';
  };

  return (
    <div>
      {/* 工具网格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
        {currentTools.map((tool) => (
            <div 
              key={tool.id}
              className="tool-card bg-white rounded-xl border border-slate-200 p-4 hover:shadow-xl transition-all duration-300 group relative cursor-pointer hover:-translate-y-1"
              onClick={() => window.openToolDetail?.(tool)}
              data-name={tool.name}
              data-description={tool.description}
              data-category={tool.category}
              data-tags={(tool.tags || []).join(',').toLowerCase()}
              data-pricing={tool.pricing}
              data-rating={tool.rating}
              data-url={getToolUrl(tool)}
            >
              <div className="flex justify-between items-start mb-3">
                {/* 工具图标 */}
                <div className="flex-1">
                  {tool.logo ? (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center overflow-hidden shadow-sm group-hover:shadow transition">
                      <img 
                        src={tool.logo} 
                        alt={tool.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          // 加载失败时显示emoji图标
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center text-white text-xl">
                              ${getEmojiIcon(tool.category)}
                            </div>
                          `;
                        }}
                        onLoad={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'block';
                        }}
                      />
                    </div>
                  ) : (
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getGradientClass(tool.category)} flex items-center justify-center text-white text-xl shadow-sm group-hover:shadow transition`}>
                      {getEmojiIcon(tool.category)}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {/* 对比复选框 */}
                  <label className="w-6 h-6 border-2 border-slate-300 rounded flex items-center justify-center cursor-pointer hover:border-blue-500 transition bg-white" title="添加到对比">
                    <input type="checkbox" className="peer hidden compare-checkbox" data-tool-name={tool.name} />
                    <div className="w-3 h-3 bg-blue-500 rounded-sm scale-0 peer-checked:scale-100 transition-transform"></div>
                  </label>
                  
                  {/* 收藏按钮 */}
                  <button className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-red-500 transition">
                    <i className="fa-regular fa-heart"></i>
                  </button>
                </div>
              </div>
              
              {/* 工具标题 */}
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 mb-1.5 group-hover:text-blue-600 transition text-base">{tool.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 h-8 leading-relaxed">{tool.description}</p>
              </div>
              
              {/* 标签 */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {(tool.tags || []).slice(0, 3).map((tag: string) => (
                  <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full group-hover:bg-blue-50 group-hover:text-blue-600 transition">{tag}</span>
                ))}
              </div>
              
              {/* 评分和直达 */}
              <div className="mt-3 flex justify-between items-center border-t border-slate-100 pt-3">
                <div className="flex items-center">
                  <div className="flex items-center text-amber-400 text-xs">
                    {Array(5).fill(0).map((_, i) => (
                      <i key={i} className={`fa-solid fa-star ${i < Math.floor(tool.rating) ? '' : 'fa-star-half-stroke'}`}></i>
                    ))}
                  </div>
                  <span className="ml-1 text-xs text-slate-500 font-medium">{tool.rating}</span>
                </div>
                <a
                  href={getToolUrl(tool)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-100 transition font-medium flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  直达 <i className="fa-solid fa-arrow-right ml-0.5 text-[10px]"></i>
                </a>
              </div>
            </div>
          ))}
        </div>

      {/* 无结果提示 */}
      {displayTools.length === 0 && (
        <div className="py-12 text-center">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-magnifying-glass-minus text-slate-300 text-4xl"></i>
          </div>
          <h3 className="text-lg font-medium text-slate-900">未找到相关工具</h3>
          <p className="text-slate-500 mt-2">尝试更换关键词或调整筛选条件</p>
        </div>
      )}

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="py-8 text-center">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 mx-1 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            上一页
          </button>
          <span className="mx-4 text-slate-600">
            第 {currentPage} / {totalPages} 页，共 {displayTools.length} 个工具
          </span>
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 mx-1 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
}
