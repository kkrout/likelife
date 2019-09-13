package com.dong.life;

import com.itextpdf.text.Document;
import com.itextpdf.text.pdf.*;

import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.util.*;

/**
 * pdf模板工具类，用于生成指定模板的pdf文件
 */
public class PdfTemplateUtil
{


    /**
     * 根据pdf模板导出pdf文件
     * @param templatePath  模板路径
     * @param out  输出文件流
     * @param data 绑定的数据列表
     * @throws Exception
     */
    public static void fillTemplate(String templatePath, OutputStream out, Map<String,String> data) throws Exception
    {
        fillTemplate(templatePath,out,Arrays.asList(data));
    }

    /**
     * 根据pdf模板导出pdf文件
     * @param templatePath  模板路径
     * @param out  输出文件流
     * @param dataList 绑定的数据列表
     * @throws Exception
     */
    public static void fillTemplate(String templatePath, OutputStream out, List<Map<String,String>> dataList) throws Exception
    {
        Document doc = new Document();
        PdfCopy copy = new PdfCopy(doc, out);
        PdfReader reader = new PdfReader(templatePath);
        try{
            doc.open();
            for(Map<String,String> data:dataList){
                PdfImportedPage importPage = copy.getImportedPage(
                        new PdfReader(fillPage(reader,data).toByteArray()), 1);
                copy.addPage(importPage);
            }
        }finally
        {
            reader.close();
            copy.close();
            doc.close();
            out.close();
        }
    }

    private static ByteArrayOutputStream fillPage(PdfReader reader,Map<String,String> data) throws Exception
    {
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        PdfStamper stamper = new PdfStamper(reader, bos);
        /*使用中文字体 */
        BaseFont bfChinese = BaseFont.createFont( "STSongStd-Light" ,"UniGB-UCS2-H",BaseFont.NOT_EMBEDDED);
        ArrayList<BaseFont> fontList = new ArrayList<>();
        fontList.add(bfChinese);
        AcroFields form = stamper.getAcroFields();
        form.setSubstitutionFonts(fontList);
        Set<String> fields = data.keySet();
        for(String filed:fields){
            form.setField(filed,data.get(filed));
        }
        stamper.setFormFlattening(true);//如果为false那么生成的PDF文件还能编辑，一定要设为true
        stamper.close();
        return bos;
    }


    public static void main(String[] args) throws Exception
    {
        //模板路径
        String templatePath = "e:/tmp/test.pdf";

        List<Map<String,String>> dataList = new ArrayList<>();

        Map<String,String> data = new HashMap<>();
        data.put("orgPrice","3999.99");
        data.put("sellPrice","1999.99");
        data.put("commoTitle","彩虹条婴儿针织短袖T恤");
        data.put("commoName","彩虹条婴儿针织短袖T恤规格40g/11x20cm");
        data.put("validTime","有效期：2018.01.01-2019.01.01");
        dataList.add(data);
        fillTemplate(templatePath,new FileOutputStream("e:/tmp/test2.pdf"),dataList);
    }

}
