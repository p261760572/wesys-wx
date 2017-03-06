function logout() {
    $$.request('/action/user/logout', {}, function() {
        window.location.href = 'login.html';
    });
}

function onClickNode(event, treeId, treeNode, clickFlag) {
    var zTree = $.fn.zTree.getZTreeObj(treeId);
    zTree.expandNode(treeNode, null, null, null, true);
    if (treeNode.attributes && treeNode.attributes.url) {
        if ($('#main-tabs').tabs('getTab', treeNode.menu_name) == null) {
            $('#main-tabs').tabs('add', {
                title: treeNode.menu_name,
                content: '<iframe  src="' + treeNode.attributes.url + '" frameborder="0" style="width:100%; height:100%; border: 0; overflow: hidden;"></iframe>',
                closable: true
            });
        } else {
            $('#main-tabs').tabs('select', treeNode.menu_name);
        }
    }
}

$(function() {

    $$.request('/action/user/view', {}, function(data) {
        $('#login-name').html(data.data.login_name);
    });

    $$.request('/action/user/menu', {}, function(data) {
        var setting = {
            data: {
                key: {
                    name: 'menu_name'
                },
                simpleData: {
                    enable: true,
                    idKey: 'menu_id',
                    pIdKey: 'menu_pid'
                }
            },
            callback: {
                onClick: onClickNode
            }
        };

        for (var i = 0, l = data.rows.length; i < l; i++) {
            if (data.rows[i].url) {
                //data.rows[i].target = 'content';
                data.rows[i].attributes = {
                    url: data.rows[i].url
                }
                data.rows[i].url = null;
            }
        }

        $.fn.zTree.init($("#nav-tree"), setting, data.rows);
        $.fn.zTree.getZTreeObj('nav-tree').expandAll(true);
    });
});
