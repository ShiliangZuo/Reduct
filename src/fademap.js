var ExprManager = (function() {
    let pub = {};

    var _FADE_MAP = {
        'if':       [LockIfStatement, IfStatement],
        'ifelse':   [IfElseStatement],
        'triangle': [TriangleExpr, FadedTriangleExpr],
        'rect':     [RectExpr, FadedRectExpr],
        'star':     [StarExpr, FadedStarExpr],
        'circle':   [CircleExpr, FadedCircleExpr],
        'diamond':  [RectExpr, FadedRectExpr],
        '_':        [MissingExpression],
        '__':       [MissingBagExpression],
        '_b':       [MissingBooleanExpression],
        'true':     [KeyTrueExpr, TrueExpr],
        'false':    [KeyFalseExpr, FalseExpr],
        'cmp':      [MirrorCompareExpr, CompareExpr, FadedCompareExpr],
        '==':       [MirrorCompareExpr, CompareExpr, FadedCompareExpr],
        '!=':       [MirrorCompareExpr, CompareExpr, FadedCompareExpr],
        'bag':      [BagExpr, BracketArrayExpr],
        'count':    [CountExpr],
        'map':      [FunnelMapFunc, SimpleMapFunc, FadedMapFunc],
        'reduce':   [ReduceFunc],
        'put':      [PutExpr],
        'pop':      [PopExpr],
        'define':   [DefineExpr],
        'var':      [LambdaVarExpr, FadedLambdaVarExpr],
        'hole':     [LambdaHoleExpr, FadedLambdaHoleExpr],
        'lambda':   [LambdaHoleExpr, FadedLambdaHoleExpr]
    };
    var fade_level = {};
    var DEFAULT_FADE_LEVEL = 0;

    pub.getClass = (ename) => {
        if (ename in _FADE_MAP) {
            return _FADE_MAP[ename][pub.getFadeLevel(ename)];
        } else {
            console.error('Expression type ' + ename + ' is not in the fade map.');
            return undefined;
        }
    };
    pub.getFadeLevel = (ename) => {
        if (ename in fade_level)
            return fade_level[ename];
        else if ((ename === 'var' || ename === 'hole') && 'lambda' in fade_level)
            return fade_level['lambda'];
        else if (DEFAULT_FADE_LEVEL >= pub.getNumOfFadeLevels(ename))
            return pub.getNumOfFadeLevels(ename) - 1;
        else
            return DEFAULT_FADE_LEVEL;
    };
    pub.getNumOfFadeLevels = (ename) => {
        if (!ename) return;
        else if (!(ename in _FADE_MAP)) {
            console.error('Expression type ' + ename + ' is not in the fade map.');
            return;
        }
        return _FADE_MAP[ename].length;
    };
    pub.setFadeLevel = (ename, index) => {
        if (!ename) return;
        else if (!(ename in _FADE_MAP)) {
            console.error('Expression type ' + ename + ' is not in the fade map.');
            return;
        } else if (pub.getNumOfFadeLevels(ename) >= index) {
            console.warn('Expression type ' + ename + ' has only ' + pub.getNumOfFadeLevels(ename) + ' fade levels. (' + index + 'exceeds)');
            index = pub.getNumOfFadeLevels(ename) - 1; // Set to max fade.
        }
        fade_level[ename] = index;
    };
    pub.setDefaultFadeLevel = (index) => {
        if (index >= 0) DEFAULT_FADE_LEVEL = index;
    };
    pub.clearFadeLevels = () => {
        fade_level = {};
    };

    return pub;
})();
