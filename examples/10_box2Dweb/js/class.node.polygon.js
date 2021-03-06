
/**
* A CGSGNodePolygon represent a basic polygon
*
* @class CGSGNodePolygon
* @module Node
* @extends CGSGNode
* @constructor
* @param {Array} points of polygon
* @type {CGSGNodePolygon}
* @author Paul Todd
*/
var CGSGNodePolygon = CGSGNode.extend(
	{
		initialize: function (points) {

			this._points = points.copy();
			this._numPoints = this._points.length;
			this._minX = 0;
			this._minY = 0;
			this._maxX = 0;
			this._maxY = 0;			
			
			this.updateMinMax();
			
			this._super(this._minX, this._minY, this._maxX-this._minX, this._maxY-this._minY);
			

			this.pickNodeMethod = CGSGPickNodeMethod.GHOST;

			/**
			 * @property classType
			 * @readonly
			 * @type {String}
			 */
			this.classType = "CGSGNodePolygon";
		},
		
        /**
		* Custom rendering
		* @method render
		* @protected
		* @param {CanvasRenderingContext2D} context the context into render the node
		* */
		render: function (context) {
			//save current state
			this.beforeRender(context);

			this.doRenderLogic(context);

			//restore state
			this.afterRender(context);
		},
		
		/**
         * Render the polygon
         * @public
         * @method doRenderLogic
         * @param {CanvasRenderingContext2D} context the context into render the node
        */	
		doRenderLogic: function (context) {
           	context.beginPath();
			
			context.moveTo(this._points[0].x-this._minX, this._points[0].y-this._minY);

           	for(var n = 1; n < this._numPoints; n++) {
                	context.lineTo(this._points[n].x-this._minX, this._points[n].y-this._minY);
            	}
           	context.closePath();

			context.fill();
		},
		
		/**
		 * Replace current dimension by these new ones and compute new Points
		 * @method resizeTo
		 * @param {Number} newWidth
		 * @param {Number} newHeight
		 * */
		resizeTo: function (newWidth, newHeight) {
			this.dimension.resizeTo(newWidth, newHeight);

			this._computeResizedPoints();
		},

		/**
		 * Multiply current dimension by these new ones
		 * @method resizeTBy
		 * @param {Number} widthFactor
		 * @param {Number} heightFactor
		 * */
		resizeBy: function (widthFactor, heightFactor) {
			this.dimension.resizeBy(widthFactor, heightFactor);

			this._computeResizedPoints();
		},

		/**
		 * Increase/decrease current dimension with adding values
		 * @method resizeWith
		 * @param {Number} width
		 * @param {Number} height
		 * */
		resizeWith: function (width, height) {
			this.dimension.resizeWith(width, height);

			this._computeResizedPoints();
		},

		/**
		 * @method _computeResizedPoints
		 * @private
		 */
		_computeResizedPoints: function () {
			var scaleX = this.getWidth() / (this._maxX-this._minX);
			var scaleY = this.getHeight() / (this._maxY-this._minY);
			var center = this.getCenter();
			
			if(this.getWidth() > 0 && this.getHeight() > 0){
				for(i = 0; i < this._numPoints; i++){
					this._points[i].x = (scaleX * (this._points[i].x-center.x)) + center.x;
					this._points[i].y = (scaleY * (this._points[i].y-center.y)) + center.y;
				}
				this.updateMinMax();
			}			
		},
		
        /**
         * Find the center of the polygon
         * @public
         * @method getCenter
        */
		getCenter: function () {
			return new CGSGPosition((this._maxX-this._minX) / 2, (this._maxY-this._minY) / 2);
		},
		
        /**
         * Get the Largest x of the polygon
         * @public
         * @method getMaxX
        */
		getMaxX: function () {
			var xmax = 0, tempx = 0;
			
			xmax = this._points[0].copy().x;
			
			for(i = 1; i < this._numPoints; i++){
				tempx = this._points[i].copy().x;
				if(xmax <= tempx){
					xmax = tempx;
				}
			}

			return xmax;
		},
		
        /**
         * Get the smallest x of the polygon
         * @public
         * @method getMinX
        */
		getMinX: function () {
			var xmin = 0, tempx = 0;
			
			xmin = this._points[0].copy().x;
			
			for(i = 1; i < this._numPoints; i++){
				tempx = this._points[i].copy().x;
				
				if(xmin >= tempx){
					xmin = tempx;
				}
			}
		
			return xmin;
		},
		
        /**
         * Get the Largets y of the polygon
         * @public
         * @method getMaxY
        */
		getMaxY: function () {
			var ymax = 0, tempy = 0;
			
			ymax = this._points[0].copy().y;
			
			for(i = 1; i < this._numPoints; i++){
				tempy = this._points[i].copy().y;
				
				if(ymax <= tempy){
					ymax = tempy;
				}
			}
		
			return ymax;
		},
		
        /**
         * Get the smallest y of the polygon
         * @public
         * @method getMinY
        */
		getMinY: function () {
			var ymin = 0, tempy = 0;
			
			ymin = this._points[0].copy().y;
			
			for(i = 1; i < this._numPoints; i++){
				tempy = this._points[i].copy().y;
				
				if(ymin >= tempy){
					ymin = tempy;
				}
			}
		
			return ymin;
		},
		
		/**
         * Update the min and max x/y values
         * @method updateMinMax
        */
		updateMinMax: function () {
			this._maxY = this.getMaxY();
			this._minY = this.getMinY();
			this._maxX = this.getMaxX();
			this._minX = this.getMinX();
		},
		
		/**
         * Set the points of the polygon
         * @public
         * @method setPoints
        */
		setPoints: function (points) {
			this._points = points.copy();
			this._numPoints = this._points.length;
			this.updateMinMax();			
			this.dimension.resizeTo(this._maxX-this._minX, this._maxY-this._minY);
		},
		
        /**
         * Get the points of the polygon
         * @public
         * @method getPoints
        */
		getPoints: function () {
			return this._points.copy();
		},
		
		/**
         * Get a point of the polygon at index
         * @public
         * @method getPoint
         * @param index
        */
		getPoint: function (index) {
			if(index < this._numPoints && index >= 0){
			  return this._points.slice(index, index + 1).copy();
			}
			return this._points.slice(0,1).copy();
		},
		
		/**
		* @method renderGhost
		* @param {CanvasRenderingContext2D} ghostContext the context into render the node
		*/
		renderGhost: function (ghostContext) {
			//save current state
			this.beforeRenderGhost(ghostContext);
			
			if (this.globalAlpha > 0) {
				this.doRenderLogic(ghostContext);
			}
			//restore state
			this.afterRenderGhost(ghostContext);
		},

		/**
		 * @method copy
		 * @return {CGSGNodePolygon} a copy of this node
		 */
		copy: function () {
			var node = new CGSGNodePolygon(this._points);
			//call the super method
			node = this._super(node);

			node.color = this.color;
			node.lineColor = this.lineColor;
			node.lineWidth = this.lineWidth;
			return node;
		}

	}
);