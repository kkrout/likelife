package com.dong.life.api.system;

import com.dong.life.document.MenuDocument;
import com.dong.life.exception.CommonException;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/system/menu")
public class MenuApi {

    @Autowired
    MongoTemplate mongoTemplate;

    @RequestMapping("list")
    public List<MenuDocument> getList(){
        return mongoTemplate.find(new Query(Criteria.where("root").is(true)),MenuDocument.class);
    }

    @RequestMapping("add/{parentId}")
    public void add(@PathVariable("parentId")String parentId, @RequestBody MenuDocument menu){

        if ( StringUtils.isBlank(menu.getName())){
            throw new CommonException(10000,"菜单名称参数必输");
        }

        //根节点
        if ( "-1".equals(parentId) ){
            menu.setRoot(true);
        }

        mongoTemplate.save(menu);

        //非root需要挂到父菜单下面
        if ( !menu.isRoot() ){
            Criteria criteria = new Criteria();
            criteria.and("menuId").is(parentId);
            MenuDocument parent = mongoTemplate.findOne(new Query(criteria), MenuDocument.class);
            if ( parent == null){
                mongoTemplate.remove(menu);
                throw new CommonException(10000,"没有找到父节点");
            }

            List<MenuDocument> children = parent.getChildren();
            if ( children == null){
                parent.setChildren(Arrays.asList(menu));
            }else{
                children.add(menu);
            }
            mongoTemplate.save(parent);
        }
    }

    @RequestMapping("save")
    public void save(@RequestBody MenuDocument menu){
        mongoTemplate.save(menu);
    }

    @RequestMapping("remove/{menuId}")
    public void remove(@PathVariable("menuId")String menuId){
        mongoTemplate.remove(new Query(Criteria.where("menuId").is(menuId)),MenuDocument.class);
    }
}
