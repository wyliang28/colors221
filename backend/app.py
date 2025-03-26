from flask import Flask, request, jsonify
import pymysql
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

db_config = {
    'host': '113.44.40.156',
    'port': 3306,
    'user': 'root',
    'password': 'Lyy..hf28',
    'database': 'inventory',
    'charset': 'utf8mb4'
}


def get_db():
    return pymysql.connect(**db_config)

@app.route('/api/colors', methods=['GET'])
def get_colors():
    conn = get_db()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    cursor.execute('SELECT * FROM colors')
    colors = cursor.fetchall()
    conn.close()
    return jsonify([{
        'id': color['id'],
        'name': color['name'],
        'color_id': color['color_id'],
        'label': color['label'],
        'class': color['class'],
        'num': color['num']
    } for color in colors])

@app.route('/api/packages', methods=['POST'])
def create_package():
    data = request.get_json()
    conn = get_db()
    cursor = conn.cursor()

    if not data.get('name') or not data.get('colors'):
        return jsonify({'error': 'name and colors cannot be null'}), 400

    cursor.execute('''
        INSERT INTO packages (name, colors, color_num)
        VALUES (%s, %s, %s)
    ''', (data['name'], ','.join(map(str, data['colors'])), data.get('color_num', 10)))

    conn.commit()
    conn.close()

    return jsonify({'message': 'Package created successfully'}), 201


@app.route('/api/packages', methods=['GET'])
def get_packages():
    conn = get_db()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    cursor.execute('SELECT * FROM packages')
    packages = cursor.fetchall()
    conn.close()
    return jsonify([{
        'id': package['id'],
        'name': package['name'],
        'colors': package['colors'],
        'color_num': package['color_num']
    } for package in packages])

@app.route('/api/packages/<int:id>', methods=['DELETE'])
def delete_package(id):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute('DELETE FROM packages WHERE id = %s', (id,))
    conn.commit()

    conn.close()
    return jsonify({'message': 'Package deleted successfully'}), 200

@app.route('/api/orders', methods=['GET'])
def get_orders():
    conn = get_db()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    cursor.execute('SELECT * FROM orders')
    orders = cursor.fetchall()
    conn.close()
    return jsonify([{
        'id': order['id'],
        'package_name': order['package_name'],
        'package_num': order['package_num'],
        'date': order['date'].strftime('%Y-%m-%d %H:%M:%S')  # 格式化日期
    } for order in orders])

@app.route('/api/orders', methods=['POST'])
def create_order():
    data = request.get_json()

    if not data.get('package_name') or not data.get('package_num'):
        return jsonify({'error': 'package_name and package_num cannot be null'}), 400

    conn = get_db()
    cursor = conn.cursor(pymysql.cursors.DictCursor)

    cursor.execute('''
        INSERT INTO orders (package_name, package_num, date)
        VALUES (%s, %s, %s)
    ''', (data['package_name'], data['package_num'], datetime.now().strftime('%Y-%m-%d %H:%M:%S')))
    conn.commit()

    package_name = data['package_name']
    package_num = int(data['package_num'])

    cursor.execute('SELECT * FROM packages WHERE name = %s', (package_name,))
    package = cursor.fetchone()
    if package:
        color_names = package['colors'].split(',')
        color_num = package['color_num']

        for color_name in color_names:
            cursor.execute('UPDATE colors SET num = num - %s WHERE name = %s', (color_num * package_num, color_name))

        conn.commit()

    conn.close()
    return jsonify({'message': 'Order created successfully'}), 201

@app.route('/api/orders/<int:id>', methods=['DELETE'])
def delete_order(id):
    conn = get_db()
    cursor = conn.cursor(pymysql.cursors.DictCursor)

    cursor.execute('SELECT package_name, package_num FROM orders WHERE id = %s', (id,))
    order = cursor.fetchone()
    if order:
        package_name = order['package_name']
        package_num = int(order['package_num'])

        cursor.execute('SELECT * FROM packages WHERE name = %s', (package_name,))
        package = cursor.fetchone()
        if package:
            color_names = package['colors'].split(',')
            color_num = package['color_num']

            for color_name in color_names:
                cursor.execute('UPDATE colors SET num = num + %s WHERE name = %s', (color_num * package_num, color_name))

            cursor.execute('DELETE FROM orders WHERE id = %s', (id,))
            conn.commit()

    conn.close()
    return jsonify({'message': 'Order deleted successfully'}), 200

@app.route('/api/increasestock', methods=['GET'])
def get_increase_stock():
    conn = get_db()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    cursor.execute('SELECT * FROM increase_colors ORDER BY date DESC')  # 按照时间降序排列
    records = cursor.fetchall()
    conn.close()
    return jsonify([{
        'id': record['id'],
        'name': record['name'],
        'increase_num': record['increase_num'],
        'date': record['date'].strftime('%Y-%m-%d %H:%M:%S')  # 格式化时间
    } for record in records])

@app.route('/api/increasestock', methods=['POST'])
def create_increase_stock():
    data = request.get_json()
    color_name = data['name']
    increase_num = data['increase_num']

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute('UPDATE colors SET num = num + %s WHERE name = %s', (increase_num, color_name))

    cursor.execute('''
        INSERT INTO increase_colors (name, increase_num)
        VALUES (%s, %s)
    ''', (color_name, increase_num))

    conn.commit()
    conn.close()

    return jsonify({'message': '库存增加成功'})

if __name__ == '__main__':
    app.run(debug=True)
