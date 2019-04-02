layui.define(['table'], function (exports) {

    var $ = layui.jquery;

    // 封装方法
    var mod = {
        /**
         * 渲染入口
         * @param myTable
         */
        render: function (myTable) {
            var tableBox = $(myTable.elem).next().children('.layui-table-box'),
                $head = $(tableBox.children('.layui-table-header').children('table').children('thead').children('tr').toArray()),
                $main = $(tableBox.children('.layui-table-body').children('table').children('tbody').children('tr').toArray().reverse()),
                $fixLeft = $(tableBox.children('.layui-table-fixed-l').children('.layui-table-body').children('table').children('tbody').children('tr').toArray().reverse()),
                $fixRight = $(tableBox.children('.layui-table-fixed-r').children('.layui-table-body').children('table').children('tbody').children('tr').toArray().reverse()),
                cols = myTable.cols, mergeRecord = {};

            cols.forEach(function(item, index) {
                for (let i = 0; i < item.length; i++) {
                    var item3 = item[i], field=item3.field;
                    if (item3.merge) {
                        var mergeField = [field];
                        if (item3.merge !== true) {
                            if(item3.colspan && item3.rowspan){
                                $head.eq(index).children().eq(i).children('div').css('width',theadMerge(item3.merge,mergeField,[index,item3.rowspan]))
                            } else if (typeof item3.merge == 'string') {
                                mergeField = [item3.merge]
                            } else {
                                mergeField = item3.merge
                            }
                        }
                        mergeRecord[i] = {mergeField: mergeField, rowspan:1}
                    }
                }
            });

            $main.each(function (i) {
                for (var item in mergeRecord) {
                    if (i==$main.length-1 || isMaster(i, item)) {
                        $(this).children('[data-key$="-'+item+'"]').attr('rowspan', mergeRecord[item].rowspan).css('position','static');
                        $fixLeft.eq(i).children('[data-key$="-'+item+'"]').attr('rowspan', mergeRecord[item].rowspan).css('position','static');
                        $fixRight.eq(i).children('[data-key$="-'+item+'"]').attr('rowspan', mergeRecord[item].rowspan).css('position','static');
                        mergeRecord[item].rowspan = 1;
                    } else {
                        $(this).children('[data-key$="-'+item+'"]').remove();
                        $fixLeft.eq(i).children('[data-key$="-'+item+'"]').remove();
                        $fixRight.eq(i).children('[data-key$="-'+item+'"]').remove();
                        mergeRecord[item].rowspan +=1;
                    }
                }
            })

            function isMaster (index, item) {
                var mergeField = mergeRecord[item].mergeField;
                var dataLength = layui.table.cache[myTable.id].length;
                for (var i=0; i<mergeField.length; i++) {

                    if (layui.table.cache[myTable.id][dataLength-2-index][mergeField[i]]
                        !== layui.table.cache[myTable.id][dataLength-1-index][mergeField[i]]) {
                        return true;
                    }
                }
                return false;
            }

            function theadMerge(colNum,fid,rowNum){
                var width = 0;
                for(let i = rowNum[1] + rowNum[0] - 1 ;i >= rowNum[0] ;i--){
                    // for(let j = colNum[0];j < colNum[1];j++){
                        $cell = $head.eq(i).children('[data-parentkey$="-'+rowNum[0]+'"]')
                        $cell.each(function (j){
                            $(this).addClass('layui-hide');
                            width += parseInt($(this).children('div').css('width'))
                        })
                    // }
                }
                return width+'px';
            }
        }
    };

    // 输出
    exports('tableMerge', mod);
});

